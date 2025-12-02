import express from "express";
import Order from "../models/Order.js";

import Product from "../models/Product.js";

const router = express.Router();

// **THE FIX**: This route is now much smarter.
// It takes a single checkout and creates multiple orders, one for each seller.
router.post("/create", async (req, res) => {
    try {
        const { buyerId, products, totalAmount, shippingAddress, paymentMethod } = req.body;

        // Step 1: Group products by their sellerId
        const ordersBySeller = products.reduce((acc, product) => {
            const sellerId = product.sellerId.toString();
            if (!acc[sellerId]) {
                acc[sellerId] = [];
            }
            acc[sellerId].push(product);
            return acc;
        }, {});

        // Step 2: Create a separate order for each seller
        const createdOrders = [];
        for (const sellerId in ordersBySeller) {
            const sellerProducts = ordersBySeller[sellerId];
            
            // Calculate the total amount for this specific seller's order
            const sellerTotalAmount = sellerProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);

            const newOrder = new Order({
                buyerId,
                sellerId, // Add the sellerId to the top-level of the order
                products: sellerProducts,
                totalAmount: sellerTotalAmount,
                shippingAddress,
                paymentMethod,
                status: 'Pending', // All new orders start as pending
            });
            const savedOrder = await newOrder.save();
            createdOrders.push(savedOrder);
        }

        res.status(201).json({ message: "Orders created successfully!", orders: createdOrders });

    } catch (err) {
        console.error("--- ERROR CREATING ORDER ---");
        console.error("Error Name:", err.name);
        console.error("Error Message:", err.message);
        if (err.errors) {
            console.error("Validation Errors:", JSON.stringify(err.errors, null, 2));
        }
        console.error("----------------------------");
        res.status(500).json({ message: "Server error while creating order.", error: err.message });
    }
});

// Get all orders for a specific buyer
router.get("/by-buyer/:buyerId", async (req, res) => {
    try {
        const orders = await Order.find({ buyerId: req.params.buyerId }).populate('sellerId', 'shopName phone email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error("Error fetching buyer's orders:", err);
        res.status(500).json({ message: "Server error while fetching orders." });
    }
});

// **NEW**: Get all orders for a specific seller
router.get("/by-seller/:sellerId", async (req, res) => {
    try {
        const orders = await Order.find({ sellerId: req.params.sellerId })
            .populate('buyerId', 'name') // Show the buyer's name to the seller
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error("Error fetching seller's orders:", err);
        res.status(500).json({ message: "Server error while fetching seller's products." });
    }
});

// **NEW**: Get a count of pending orders for a seller
router.get("/pending-count/:sellerId", async (req, res) => {
    try {
        const count = await Order.countDocuments({ 
            sellerId: req.params.sellerId, 
            status: 'Pending' 
        });
        res.json({ count });
    } catch (err) {
        console.error("Error fetching pending order count:", err);
        res.status(500).json({ message: "Server error while fetching count." });
    }
});

// **NEW**: Allow a seller to update an order's status
router.put("/update-status/:orderId", async (req, res) => {
    try {
        const { status } = req.body;
        
        // Find the order first to check previous status if needed (optional optimization)
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        // Only deduct stock if the status is changing to 'Confirmed' for the first time
        // We assume 'Pending' -> 'Confirmed' is the flow.
        if (status === 'Confirmed' && order.status !== 'Confirmed') {
             for (const product of order.products) {
                await Product.findByIdAndUpdate(product.productId, { 
                    $inc: { quantity: -product.quantity } 
                });
            }
        }

        order.status = status;
        const updatedOrder = await order.save();

        res.json({ message: "Order status updated!", order: updatedOrder });
    } catch (err) {
        console.error("Error updating order status:", err);
        res.status(500).json({ message: "Server error while updating status." });
    }
});

// **NEW**: Allow a buyer to report a delivery issue
router.put("/report-issue/:orderId", async (req, res) => {
    try {
        const { issueType, issueDescription } = req.body;
        const updateData = {
            hasDeliveryIssue: true,
            issueType,
            issueDescription,
            buyerResolved: false,
            sellerResolved: false
        };
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            updateData,
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.json({ message: "Delivery issue reported successfully!", order });
    } catch (err) {
        console.error("Error reporting delivery issue:", err);
        res.status(500).json({ message: "Server error while reporting issue." });
    }
});

// **NEW**: Allow buyer or seller to mark issue as resolved
router.put("/resolve-issue/:orderId", async (req, res) => {
    try {
        const { userType } = req.body; // 'buyer' or 'seller'
        const updateData = userType === 'buyer' ? { buyerResolved: true } : { sellerResolved: true };
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            updateData,
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        // If both have resolved, mark as resolved
        if (order.buyerResolved && order.sellerResolved) {
            await Order.findByIdAndUpdate(req.params.orderId, { hasDeliveryIssue: false });
        }
        res.json({ message: "Issue resolution updated!", order });
    } catch (err) {
        console.error("Error resolving issue:", err);
        res.status(500).json({ message: "Server error while resolving issue." });
    }
});

// **NEW**: Get count of unresolved issues for a seller
router.get("/issues-count/:sellerId", async (req, res) => {
    try {
        const count = await Order.countDocuments({
            sellerId: req.params.sellerId,
            hasDeliveryIssue: true,
            $or: [
                { buyerResolved: false },
                { sellerResolved: false }
            ]
        });
        res.json({ count });
    } catch (err) {
        console.error("Error fetching issues count:", err);
        res.status(500).json({ message: "Server error while fetching count." });
    }
});

// GET revenue analytics for a seller
router.get("/analytics/:sellerId", async (req, res) => {
    try {
        const orders = await Order.find({ sellerId: req.params.sellerId });
        
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

        let totalRevenue = 0;
        let weeklyRevenue = 0;
        let monthlyRevenue = 0;
        let yearlyRevenue = 0;
        const productSales = {};

        orders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            
            // Track product sales
            order.products.forEach(product => {
                const pName = product.name;
                const pPrice = product.price || 0;
                const pQty = product.quantity || 0;
                const pRevenue = pPrice * pQty;

                if (!productSales[pName]) {
                    productSales[pName] = {
                        name: pName,
                        totalSold: 0,
                        revenue: 0,
                        imageUrl: product.imageUrl
                    };
                }
                
                // Count "Sold" (Quantity) for all valid orders (excluding Cancelled/Rejected)
                if (!['Cancelled', 'Rejected'].includes(order.status)) {
                    productSales[pName].totalSold += pQty;
                }

                // Count Revenue only for Shipped/Delivered orders
                if (['Shipped', 'Delivered'].includes(order.status)) {
                    productSales[pName].revenue += pRevenue;
                    
                    // Add to total/periodic revenue
                    totalRevenue += pRevenue;
                    if (orderDate >= oneWeekAgo) weeklyRevenue += pRevenue;
                    if (orderDate >= oneMonthAgo) monthlyRevenue += pRevenue;
                    if (orderDate >= oneYearAgo) yearlyRevenue += pRevenue;
                }
            });
        });

        // Find best seller
        let bestSeller = null;
        let maxSold = 0;
        Object.values(productSales).forEach(product => {
            if (product.totalSold > maxSold) {
                maxSold = product.totalSold;
                bestSeller = product;
            }
        });

        res.json({
            totalRevenue: totalRevenue.toFixed(2),
            revenueByPeriod: {
                weekly: weeklyRevenue.toFixed(2),
                monthly: monthlyRevenue.toFixed(2),
                yearly: yearlyRevenue.toFixed(2)
            },
            bestSeller: bestSeller || { name: "None", totalSold: 0, revenue: 0 },
            orderStats: {
                totalOrders: orders.length,
                deliveredOrders: orders.filter(o => o.status === 'Delivered').length,
                shippedOrders: orders.filter(o => o.status === 'Shipped').length
            }
        });
    } catch (err) {
        console.error("Error fetching analytics:", err);
        res.status(500).json({ message: "Server error while fetching analytics." });
    }
});

export default router;
