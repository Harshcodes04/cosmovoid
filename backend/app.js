require("./src/config/env");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./src/routes/authRouter");
const journalRouter = require("./src/routes/journalRouter");
const spaceRouter = require("./src/routes/spaceRouter");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const loginLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 20 });

//CORS = controls who can access your backend
app.use(
  cors({
    origin: `http://localhost:${process.env.FRONTEND_PORT || 5173}`,
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", authRouter);
app.use("/api/space", spaceRouter);
app.use("/api/journal", journalRouter);
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
});

// controller throws error --> asyncHandler catches it --> calls next(err) -->→ global error handler in app.js sends the response

module.exports = app;
