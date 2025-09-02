import express from "express";
import Order from "../models/Order.js";

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
            const sellerTotalAmount = sellerProducts.reduce((sum, product) => sum + product.price, 0);

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
        const orders = await Order.find({ buyerId: req.params.buyerId }).populate('sellerId', 'shopName').sort({ createdAt: -1 });
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
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.json({ message: "Order status updated!", order });
    } catch (err) {
        console.error("Error updating order status:", err);
        res.status(500).json({ message: "Server error while updating status." });
    }
});


export default router;

