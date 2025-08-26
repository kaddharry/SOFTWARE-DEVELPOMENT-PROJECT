// **THE DEFINITIVE FIX**: Import our new config file as the very first line of code.
// This ensures all environment variables are loaded before any other module is imported.
import './config/dotenv.js';

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import orderRoutes from './routes/orderRoutes.js';

// Now that the .env is loaded, we can safely import the routes.
import userRoutes from "./routes/userRoutes.js";
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());
app.use('/api/orders', orderRoutes);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- API Routes ---
app.use("/api/users", userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working 🚀" });
});

// --- Serve React frontend build ---
app.use(express.static(path.join(__dirname, "../artisan-direct/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../artisan-direct/build", "index.html"));
});

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Start Server ---
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
