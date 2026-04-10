const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./src/routes/authRouter");
const journalRouter = require("./src/routes/journalRouter");
const spaceRouter = require("./src/routes/spaceRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
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
