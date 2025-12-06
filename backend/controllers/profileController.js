 const User = require('../models/User')
const bcrypt = require("bcryptjs");

// GET /api/profile/me
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to load profile" });
  }
};


// PUT /api/profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// PUT /api/profile/password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to change password" });
  }
};