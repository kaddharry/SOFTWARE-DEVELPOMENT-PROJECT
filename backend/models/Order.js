import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // **THE FIX**: Added a top-level sellerId. Each order now belongs to one buyer and one seller.
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        imageUrl: String,
        // The sellerId here is still useful for reference but the top-level one is for querying.
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        name: String,
        phone: String,
        address: String,
    },
    paymentMethod: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], 
        default: 'Pending' 
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;

