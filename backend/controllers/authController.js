// ...existing code...
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const Otp = require("../models/Otp");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtil");
const generateOTP = require("../utils/otpUtil");
const { sendSMS } = require("../utils/smsUtil");
const { sendEmail } = require("../utils/EmailUtil");

exports.registerUser = async (req, res) => {
  const { username, email, phone, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "username, email and password are required" });
  }
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or phone already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
    });
    await newUser.save();

    // generate tokens using the new user id
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    return res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
      },
      accessToken,
      refreshToken,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register error:", error.message || error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // 1. Validate inputs
    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Normalize email (lowercase)
    const identifier = emailOrPhone.includes("@")
      ? emailOrPhone.toLowerCase()
      : emailOrPhone;

    // 3. Search user
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    // Same message for user not found (for security)
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email/phone or password" });
    }

    // 4. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid email/phone or password" });
    }

    // 5. Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // 6. Response
    return res.json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      accessToken,
      refreshToken,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error.message || error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Generate new access token
    const accessToken = generateAccessToken(decoded.id);

    return res.status(200).json({
      accessToken,
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

exports.logoutUser = (req, res) => {
  // Since we are using JWTs (stateless), "logout" is mostly a client-side action
  // (deleting the token). However, we provide an endpoint for consistency.
  res.status(200).json({ message: "Logged out successfully" });
};

exports.forgotPassword = async (req, res) => {
  const { emailOrPhone } = req.body;

  try {
    // 1. Presence check
    if (
      !emailOrPhone ||
      typeof emailOrPhone !== "string" ||
      emailOrPhone.trim() === ""
    ) {
      return res.status(400).json({ message: "Email or phone is required" });
    }
    // Validate format
    if (
      !validator.isEmail(emailOrPhone) &&
      !validator.isMobilePhone(emailOrPhone, "en-IN")
    ) {
      return res.status(400).json({ message: "Invalid email or phone format" });
    }

    // Find user
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create OTP
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Delete old OTP
    await Otp.deleteMany({ emailOrPhone });

    // Save new OTP with expiry
    await Otp.create({
      emailOrPhone,
      otp: hashedOTP,
    });

    // Send OTP
    if (validator.isEmail(emailOrPhone)) {
      await sendEmail({
        email: emailOrPhone,
        subject: "Password Reset OTP",
        message: `Your OTP is: ${otp}. It expires in 10 minutes.`,
      });
    } else {
      await sendSMS(`+91${emailOrPhone}`, `Your OTP is: ${otp}`);
    }

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// @desc    Reset Password using OTP
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  const { emailOrPhone, otp, newPassword } = req.body;

  try {
    // 1. Presence check
    if (!emailOrPhone || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // OPTIONAL: Password strength check
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // 2. Get OTP (anti-enumeration logic)
    const otpRecord = await Otp.findOne({ emailOrPhone });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP or expired" });
    }

    // 3. Validate OTP
    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP or expired" });
    }

    // 4. Fetch user (NEVER reveal if user does not exist)
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) {
      // Still delete OTP to prevent reuse
      await Otp.deleteOne({ emailOrPhone });

      // Do NOT reveal user existence
      return res.status(200).json({
        message: "Password reset successful",
      });
    }

    // 5. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // 6. Delete OTP after successful reset
    await Otp.deleteOne({ emailOrPhone });

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
