const express = require("express");
const app = express();

const authRouter = require("./src/routes/authRouter");
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
module.exports = app;
