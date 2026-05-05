const ApiCache = require("../models/apiCache");

exports.get = async (key) => {
  try {
    const dbItem = await ApiCache.findOne({ key }).lean();
    if (dbItem && Date.now() < dbItem.expiry) {
      return dbItem.data;
    }
  } catch (err) {
    console.error("Cache DB get error:", err.message);
  }
  return null;
};

// Fallback to get expired/stale data if API fails (rate limits)
exports.getStale = async (key) => {
  try {
    const dbItem = await ApiCache.findOne({ key }).lean();
    if (dbItem) {
      return dbItem.data;
    }
  } catch (err) {
    console.error("Cache DB getStale error:", err.message);
  }
  return null;
};

exports.set = (key, data, ttlMs) => {
  const expiry = Date.now() + ttlMs;
  
  ApiCache.findOneAndUpdate(
    { key },
    { data, expiry },
    { upsert: true, returnDocument: 'after' }
  ).catch(err => console.error("Cache DB write error:", err.message));
};
