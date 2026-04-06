const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "views");

app.get("/void", (req, res) => {
  res.send("Hello World!");
});
app.post("/void", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
