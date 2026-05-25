const express = require("express");
const authRouter = express.Router();
const authController = require("../controller/authController");
const authMiddleware = require("../middleware/auth");
const { signupLimiter, otpLimiter } = require("../middleware/rateLimiter");

authRouter.post("/signup", signupLimiter, authController.postSignup);
authRouter.post("/login", authController.postLogin);
authRouter.get("/me", authMiddleware, authController.getMe);
authRouter.post("/logout", authController.postLogout);
authRouter.post("/send-otp",        otpLimiter, authController.sendOTP);
authRouter.post("/verify-otp",      authController.verifyOTPHandler);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password",  authController.resetPassword);
authRouter.delete("/account",       authMiddleware, authController.deleteAccount);
authRouter.patch("/profile",        authMiddleware, authController.updateProfile);

module.exports = authRouter;

