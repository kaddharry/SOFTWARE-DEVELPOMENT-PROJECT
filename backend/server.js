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
// **FIX**: Rely on the PORT provided by the hosting environment (like Render).
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  // This allows both your local and live frontend to connect.
  origin: [
    'http://localhost:3000', 
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

// **THE FIX**: The code that served the static frontend files has been removed.
// The backend's only job is to be an API.

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Start Server ---
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
