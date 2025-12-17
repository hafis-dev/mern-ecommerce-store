const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const Otp = require("../models/Otp");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const generateOTP = require("../utils/otpUtil");
const { sendSMS } = require("../utils/sendSMS");
const { sendEmail } = require("../utils/sendEmail");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;

exports.registerUser = async (req, res) => {
  const { username, email, phone, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Username, email and password are required",
    });
  }

  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      message:
        "Username must be 3–20 characters long and contain only letters, numbers, and underscores",
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }

  if (phone && !phoneRegex.test(phone)) {
    return res.status(400).json({
      message: "Phone number must be 10 digits",
    });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or phone already exists",
      });
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

    const accessToken = generateAccessToken(newUser._id, newUser.isAdmin);
    const refreshToken = generateRefreshToken(newUser._id);
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        isAdmin: newUser.isAdmin,
      },
      accessToken,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password, rememberMe } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const value = emailOrPhone.trim();
    let identifier = null;

    if (emailRegex.test(value)) {
      identifier = value.toLowerCase();
    } else if (phoneRegex.test(value)) {
      identifier = value;
    } else {
      return res.status(400).json({
        message: "Enter a valid email or 10-digit phone number",
      });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email/phone or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email/phone or password",
      });
    }

    const accessToken = generateAccessToken(user._id, user.isAdmin);
    const refreshToken = generateRefreshToken(user._id, rememberMe);


    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: rememberMe
        ? 7 * 24 * 60 * 60 * 1000 
        : 24 * 60 * 60 * 1000, 
    });

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      accessToken,
      message: "User Login successfully",
    });
  } catch (error) {
    console.error("Login error:", error?.message || error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id).select("isAdmin");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const newAccessToken = generateAccessToken(user._id, user.isAdmin);

    return res.status(200).json({
      accessToken: newAccessToken,
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};


exports.logoutUser = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

exports.forgotPassword = async (req, res) => {
  const { emailOrPhone } = req.body;

  try {
    if (!emailOrPhone) {
      return res.status(400).json({ message: "Email or phone is required" });
    }

    if (
      !validator.isEmail(emailOrPhone) &&
      !validator.isMobilePhone(emailOrPhone, "en-IN")
    ) {
      return res.status(400).json({ message: "Invalid email or phone format" });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    await Otp.deleteMany({ emailOrPhone });

    await Otp.create({
      emailOrPhone,
      otp: hashedOTP,
    });

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

exports.resetPassword = async (req, res) => {
  const { emailOrPhone, otp, newPassword } = req.body;

  try {
    if (!emailOrPhone || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const otpRecord = await Otp.findOne({ emailOrPhone });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP or expired" });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP or expired" });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) {
      await Otp.deleteOne({ emailOrPhone });
      return res.status(200).json({ message: "Password reset successful" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await Otp.deleteOne({ emailOrPhone });

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
