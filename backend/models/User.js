import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    shopName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    gender: String,
    age: Number,
    password: String,
    profilePicUrl: { type: String, default: "" }, // <-- ADD THIS LINE
    isShopOpen: { type: Boolean, default: true }, // <-- Make sure this line exists
  },
  { timestamps: true }
);

// 👇 Fix: check if already compiled, else define
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
