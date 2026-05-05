const mongoose = require("mongoose");

const apiCacheSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  expiry: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("ApiCache", apiCacheSchema);
