import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

/* ================= GET PROFILE ================= */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load profile" });
  }
};

/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({
        message: "Username cannot be empty",
      });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (email) {
      const exists = await User.findOne({ email });
      if (exists && exists._id.toString() !== req.user.id) {
        return res.status(400).json({
          message: "Email already in use",
        });
      }
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true, runValidators: true }
    ).select("-password");

    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to update profile",
    });
  }
};

/* ================= CHANGE PASSWORD ================= */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to change password",
    });
  }
};
