// This file loads the environment variables before anything else.
import './config/dotenv.js';

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  // **THE FIX**: Added your live Vercel URL to the list of allowed origins.
  origin: [
    'http://localhost:3000', // For local development
    'https://software-develpoment-project-cw4rdmqbn-kaddharrys-projects.vercel.app' 
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// --- API Routes ---
app.use("/api/users", userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);

// The backend's only job is to be an API, so the static file serving is removed.

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Start Server ---
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
