import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import Otp from "../models/otp.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import generateOTP from "../utils/otpUtil.js";
import { sendSMS } from "../utils/sendSMS.js";
import { sendEmail } from "../utils/sendEmail.js";

dotenv.config();

const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;

export const registerUser = async (req, res) => {
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
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (phone && !phoneRegex.test(phone)) {
    return res.status(400).json({
      message: "Phone number must be 10 digits",
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long",
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      phone,
      password: hashedPassword,
    });

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

export const loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password, rememberMe } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const value = emailOrPhone.trim();
    let identifier;

    if (emailRegex.test(value)) {
      identifier = value.toLowerCase();
    } else if (phoneRegex.test(value)) {
      identifier = value;
    } else {
      return res.status(400).json({
        message: "Enter a valid email or 10-digit phone number",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
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
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      accessToken,
      message: "User login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const refreshToken = async (req, res) => {
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
  } catch {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { emailOrPhone } = req.body;

  try {
    if (!emailOrPhone) {
      return res.status(400).json({ message: "Email or phone is required" });
    }

    if (
      !validator.isEmail(emailOrPhone) &&
      !validator.isMobilePhone(emailOrPhone, "en-IN")
    ) {
      return res.status(400).json({
        message: "Invalid email or phone format",
      });
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
    await Otp.create({ emailOrPhone, otp: hashedOTP });

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

export const resetPassword = async (req, res) => {
  const { emailOrPhone, otp, newPassword } = req.body;

  try {
    if (!emailOrPhone || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const otpRecord = await Otp.findOne({ emailOrPhone });

    if (!otpRecord || !(await bcrypt.compare(otp, otpRecord.otp))) {
      return res.status(400).json({
        message: "Invalid OTP or expired",
      });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (user) {
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
    }

    await Otp.deleteOne({ emailOrPhone });

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
