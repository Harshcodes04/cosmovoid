const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const { sendOTPEmail, sendPasswordResetEmail } = require("../utils/mailer");
const { saveOTP, verifyOTP } = require("../utils/otpStore");

exports.postSignup = [
  check("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({ message: "Email already registered" });
      }
      if (existingUser.username === username) {
        return res.status(409).json({ message: "Username already taken" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User created",
      user: { id: newUser._id, username, email },
    });
  }),
];

exports.postLogin = asyncHandler(async (req, res, next) => {
  const { email, username, password } = req.body;
  const loginIdentifier = (email || username || "").trim();

  if (!loginIdentifier || !password) {
    return res
      .status(400)
      .json({ message: "Email or username and password are required" });
  }

  const user = await User.findOne({
    $or: [{ email: loginIdentifier }, { username: loginIdentifier }],
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    message: "Login successful",
    user: { id: user._id, username: user.username, email: user.email },
  });
});

exports.postLogout = async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ message: "Logout successful" });
};

exports.getMe = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json({ user: req.user });
};

// Send a 6-digit OTP to the given email (pre-signup step)
exports.sendOTP = asyncHandler(async (req, res) => {
  const { email, username } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const query = username ? { $or: [{ email }, { username }] } : { email };
  const existingUser = await User.findOne(query);
  if (existingUser) {
    if (existingUser.email === email) {
      return res.status(409).json({ message: "Email already registered" });
    }
    if (username && existingUser.username === username) {
      return res.status(409).json({ message: "Username already taken" });
    }
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  await saveOTP(email, otp);
  await sendOTPEmail(email, otp);

  res.json({ message: "OTP sent" });
});

// Verify OTP — does NOT create the user, just confirms the code is valid
exports.verifyOTPHandler = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

  const result = await verifyOTP(email, otp);
  if (!result.valid) return res.status(400).json({ message: result.reason });

  res.json({ message: "OTP verified" });
});

// Send a password-reset OTP to the given email
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  // Always return 200 so we don't leak whether an email is registered
  if (!user) return res.json({ message: "If that email exists, a reset code has been sent" });

  const otp = crypto.randomInt(100000, 999999).toString();
  await saveOTP(`reset:${email}`, otp);          // separate namespace from signup OTPs
  await sendPasswordResetEmail(email, otp);

  res.json({ message: "If that email exists, a reset code has been sent" });
});

// Verify reset OTP + update password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.status(400).json({ message: "Email, OTP and new password are required" });
  if (newPassword.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters" });

  const result = await verifyOTP(`reset:${email}`, otp);
  if (!result.valid) return res.status(400).json({ message: result.reason });

  const hashed = await bcrypt.hash(newPassword, 12);
  await User.findOneAndUpdate({ email }, { password: hashed });

  res.json({ message: "Password updated successfully" });
});

exports.deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const JournalEntry = require("../models/journalEntry");

  await JournalEntry.deleteMany({ userId });
  await User.findByIdAndDelete(userId);

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({ message: "Account deleted" });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { bio } = req.body;
  if (typeof bio !== "string")
    return res.status(400).json({ message: "Invalid bio" });

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { bio: bio.trim().slice(0, 300) },
    { new: true, select: "-password" }
  );

  res.json({ user: updated });
});
