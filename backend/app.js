require("./src/config/env");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./src/routes/authRouter");
const journalRouter = require("./src/routes/journalRouter");
const spaceRouter = require("./src/routes/spaceRouter");
const contactController = require("./src/controller/contactController");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const loginLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 20 });

//CORS = controls who can access your backend
// Trust the reverse proxy (Render, Ngrok, etc.) to get the real client IP for rate limiting
app.set("trust proxy", 1);

app.use(compression());
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : [
      'http://localhost:5173',                 // local dev
      'https://cosmovoid.vercel.app',          // vercel default
      'https://cosmovoid.is-a.dev',            // custom domain
    ];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", authRouter);
app.use("/api/space", spaceRouter);
app.use("/api/journal", journalRouter);
app.post("/api/contact", contactController.sendContact);

// Health check endpoint for UptimeRobot
app.get("/", (req, res) => {
  res.status(200).send("Cosmovoid API is alive and kicking!");
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
});

// controller throws error --> asyncHandler catches it --> calls next(err) -->→ global error handler in app.js sends the response

module.exports = app;
