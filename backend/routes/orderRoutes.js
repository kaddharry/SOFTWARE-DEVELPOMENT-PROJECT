import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// Create a new order
router.post("/create", async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ message: "Order created successfully!", order: newOrder });
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ message: "Server error while creating order." });
    }
});

// Get all orders for a specific buyer
router.get("/by-buyer/:buyerId", async (req, res) => {
    try {
        const orders = await Order.find({ buyerId: req.params.buyerId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error("Error fetching buyer's orders:", err);
        res.status(500).json({ message: "Server error while fetching orders." });
    }
});

export default router;
