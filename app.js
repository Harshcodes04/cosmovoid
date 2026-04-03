const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "views");
app.get("/", (req, res) => {
  res.send("Hello World!");
});
const DB_UTIL = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
mongoose
  .connect(DB_UTIL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(
        `Server is running on port ${PORT} link: http://localhost:${PORT}`,
      );
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

module.exports = app;
