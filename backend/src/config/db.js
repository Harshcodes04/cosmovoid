const mongoose = require("mongoose");
require("./env");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error(
        "Missing MONGO_URI. Add it to backend/.env before starting the server.",
      );
    }

    await mongoose.connect(mongoUri);
  } catch (err) {
    console.log("Error connecting to MongoDB", err);
    process.exit(1);
  }
};
module.exports = connectDB;
