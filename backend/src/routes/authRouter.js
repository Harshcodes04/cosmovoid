const express = require("express");
const authRouter = express.Router();
const authController = require("../controller/authController");
const authMiddleware = require("../middleware/auth");

authRouter.post("/signup", authController.postSignup);
authRouter.post("/login", authController.postLogin);
authRouter.get("/me", authMiddleware, authController.getMe);
authRouter.post("/logout", authController.postLogout);

module.exports = authRouter;
