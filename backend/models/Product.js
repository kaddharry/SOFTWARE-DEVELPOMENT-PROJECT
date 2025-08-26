import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    // This is the crucial link back to the seller
    sellerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // This tells Mongoose the ID belongs to a document in the 'User' collection
        required: true 
    },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
