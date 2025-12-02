import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET all products for the home screen
router.get("/all", async (req, res) => {
    try {
        const products = await Product.find({})
            .populate('sellerId', 'name shopName isShopOpen') // Also get the shop status
            .sort({ createdAt: -1 });

        const shuffledProducts = products.sort(() => 0.5 - Math.random());
        res.json(shuffledProducts);
    } catch (err) {
        console.error("Error fetching all products:", err);
        res.status(500).json({ message: "Server error while fetching products." });
    }
});

// GET all products for a specific seller
router.get("/by-seller/:sellerId", async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.params.sellerId })
            .sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error("Error fetching seller's products:", err);
        res.status(500).json({ message: "Server error while fetching seller's products." });
    }
});

// Add a new product
router.post("/add", async (req, res) => {
    try {
        const { name, description, price, quantity, sellerId, imageUrl, category } = req.body;

        // Validate and convert data types before saving.
        const numericPrice = Number(price);
        const numericQuantity = Number(quantity);

        if (isNaN(numericPrice) || isNaN(numericQuantity)) {
            return res.status(400).json({ message: "Price and quantity must be valid numbers." });
        }

        const newProduct = new Product({
            name,
            description,
            price: numericPrice,
            quantity: numericQuantity,
            imageUrl,
            sellerId,
            category: category || 'General',
        });

        await newProduct.save();
        res.status(201).json({ message: "Product added successfully!", product: newProduct });

    } catch (err) {
        console.error("--- ERROR ADDING PRODUCT ---");
        console.error("Error Message:", err.message);
        res.status(500).json({ message: "Server error while adding product.", error: err.message });
    }
});

// UPDATE a product
router.put("/update/:productId", async (req, res) => {
    try {
        const { name, description, price, quantity, imageUrl, category } = req.body;

        // Validate and convert data types
        const numericPrice = Number(price);
        const numericQuantity = Number(quantity);

        if (isNaN(numericPrice) || isNaN(numericQuantity)) {
            return res.status(400).json({ message: "Price and quantity must be valid numbers." });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.productId,
            {
                name,
                description,
                price: numericPrice,
                quantity: numericQuantity,
                imageUrl,
                category: category || 'General',
            },
            { new: true } // Return the updated document
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.json({ message: "Product updated successfully!", product: updatedProduct });
    } catch (err) {
        console.error("--- ERROR UPDATING PRODUCT ---");
        console.error("Error Message:", err.message);
        res.status(500).json({ message: "Server error while updating product.", error: err.message });
    }
});

// DELETE a product
// Note: This only deletes from the products collection.
// Order history is preserved because orders store product details as embedded documents.
router.delete("/:productId", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.json({ message: "Product deleted successfully!", product: deletedProduct });
    } catch (err) {
        console.error("--- ERROR DELETING PRODUCT ---");
        console.error("Error Message:", err.message);
        res.status(500).json({ message: "Server error while deleting product.", error: err.message });
    }
});

export default router;

