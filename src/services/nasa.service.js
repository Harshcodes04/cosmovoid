const axios = require("axios");
const cache = require("../utils/cache");

exports.getApod = async () => {
  const cacheKey = `apod-${new Date().toISOString().slice(0, 10)}`;

  try {
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    const response = await axios.get(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`,
    );
    // This caches APOD per day so a previous days result does not carry into the next day
    cache.set(cacheKey, response.data, 24 * 60 * 60 * 1000);
    return response.data;
  } catch (error) {
    console.error("Full error", error.message);
    throw error;
  }
};
