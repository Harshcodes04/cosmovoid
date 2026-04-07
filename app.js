const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const authRouter = require("./src/routes/authRouter");
const journalRouter = require("./src/routes/journalRouter");
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/journal", journalRouter);
module.exports = app;
