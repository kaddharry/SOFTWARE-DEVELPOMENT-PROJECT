import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        quantity: { type: Number, required: true },
        imageUrl: String,
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
        enum: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Rejected'], 
        default: 'Pending' 
    },
    // --- THIS IS THE NEW FIELD ---
    // Tracks if the buyer has reported a delivery issue.
    hasDeliveryIssue: { type: Boolean, default: false },
    issueType: { type: String, enum: ['not_received', 'damaged', 'wrong_item', 'incomplete', 'other'], default: null },
    issueDescription: { type: String, default: '' },
    buyerResolved: { type: Boolean, default: false },
    sellerResolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;

