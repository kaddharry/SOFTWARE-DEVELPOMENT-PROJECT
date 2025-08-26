// routes/userRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, shopName, phone, address, city, state, gender, age, password } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "User with this phone number already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name, shopName, phone, address, city, state, gender, age,
      password: hashedPassword,
    });

    await newUser.save();

    const userResponse = {
      _id: newUser._id, name: newUser.name, shopName: newUser.shopName, phone: newUser.phone,
      address: newUser.address, city: newUser.city, state: newUser.state, gender: newUser.gender, age: newUser.age,
    };

    res.status(201).json({ message: "✅ User registered successfully", user: userResponse });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error during registration.", error: err.message });
  }
});

// Login user (phone + password check)
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const userResponse = {
      _id: user._id, name: user.name, shopName: user.shopName, phone: user.phone,
      address: user.address, city: user.city, state: user.state, gender: user.gender, age: user.age,
    };

    res.json({ message: "✅ Login successful", user: userResponse });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login.", error: err.message });
  }
});

// Verify user's current password
router.post("/verify-password", async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    res.json({ message: "Password verified successfully." });

  } catch (err) {
    console.error("Password verification error:", err);
    res.status(500).json({ message: "Server error during password verification." });
  }
});

// Update user profile information
router.put("/update-profile", async (req, res) => {
  try {
    const { phone, ...updateData } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { phone: phone },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "Profile updated successfully.", user: updatedUser });

  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error during profile update." });
  }
});

// **NEW**: Reset user password after OTP verification
router.put("/reset-password", async (req, res) => {
    try {
        const { phone, newPassword } = req.body;

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Find the user by phone and update their password
        const updatedUser = await User.findOneAndUpdate(
            { phone: phone },
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User with this phone number not found." });
        }

        res.json({ message: "Password has been reset successfully." });

    } catch (err) {
        console.error("Password reset error:", err);
        res.status(500).json({ message: "Server error during password reset." });
    }
});

export default router;
