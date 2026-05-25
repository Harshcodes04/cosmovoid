// routes/auth.js
import express from "express";
import crypto from "crypto";
import { sendOTPEmail } from "../utils/mailer.js";
import { saveOTP, verifyOTP } from "../utils/otpStore.js";
import User from "../models/user.js";

const router = express.Router();

// POST /auth/send-otp
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  // Check if already registered
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already registered" });

  const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit
  saveOTP(email, otp);

  try {
    await sendOTPEmail(email, otp);
    res.json({ message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send email", error: err.message });
  }
});

// POST /auth/verify-otp
router.post("/verify-otp", async (req, res) => {
  const { email, otp, name, password } = req.body;

  const result = verifyOTP(email, otp);
  if (!result.valid) return res.status(400).json({ message: result.reason });

  // OTP valid — create user
  const user = await User.create({ email, name, password }); // hash password in your User model
  res.status(201).json({ message: "Account created", userId: user._id });
});

export default router;