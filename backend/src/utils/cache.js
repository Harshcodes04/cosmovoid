const cache = {};

exports.get = (key) => {
  const item = cache[key];
  if (!item || Date.now() > item.expiry) return null;
  return item.data;
};
exports.set = (key, data, ttlMs) => {
  cache[key] = { data, expiry: Date.now() + ttlMs };
};
