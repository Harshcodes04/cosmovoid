const mongoose = require("mongoose");
require("dotenv").config();

const DB_UTIL = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_UTIL);
  } catch (err) {
    console.log("Error connecting to MongoDB", err);
    process.exit(1);
  }
};
module.exports = connectDB;
