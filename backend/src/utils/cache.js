const ApiCache = require("../models/apiCache");

exports.get = async (key) => {
  try {
    const dbItem = await ApiCache.findOne({ key }).lean();
    // expiresAt check is a safety net — MongoDB TTL index handles actual deletion
    if (dbItem && new Date() < new Date(dbItem.expiresAt)) {
      return dbItem.data;
    }
  } catch (err) {
    console.error("Cache DB get error:", err.message);
  }
  return null;
};

// Returns stale data even if expired — used as fallback when API is rate-limited
exports.getStale = async (key) => {
  try {
    const dbItem = await ApiCache.findOne({ key }).lean();
    if (dbItem) return dbItem.data;
  } catch (err) {
    console.error("Cache DB getStale error:", err.message);
  }
  return null;
};

exports.set = (key, data, ttlMs) => {
  const expiresAt = new Date(Date.now() + ttlMs);

  ApiCache.findOneAndUpdate(
    { key },
    { data, expiresAt },
    { upsert: true, returnDocument: "after" }
  ).catch((err) => console.error("Cache DB write error:", err.message));
};
