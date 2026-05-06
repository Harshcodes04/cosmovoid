const mongoose = require("mongoose");

const apiCacheSchema = new mongoose.Schema({
  key:       { type: String, required: true, unique: true },
  data:      { type: mongoose.Schema.Types.Mixed, required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });
// Documents are physically deleted 6 hours after expiresAt.
apiCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 6 * 60 * 60 });

module.exports = mongoose.model("ApiCache", apiCacheSchema);
