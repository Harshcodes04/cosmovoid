const mongoose = require("mongoose");

const apiCacheSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    source: {
      type: String,
      required: true,
      index: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    freshUntil: {
      type: Date,
      required: true,
      index: true,
    },
    staleUntil: {
      type: Date,
      required: true,
      index: true,
    },
    lastFetchedAt: {
      type: Date,
      required: true,
    },
    lastError: {
      message: String,
      status: Number,
      at: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ApiCache", apiCacheSchema);
