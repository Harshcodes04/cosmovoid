const cache = require("../utils/cache");
const axios = require("axios");

exports.getSpaceNews = async () => {
  const cacheKey = "space-news";
  const cachedData = await cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  try {
    const res = await axios.get(
      "https://api.spaceflightnewsapi.net/v4/articles/?limit=20",
    );
    cache.set(cacheKey, res.data, 60 * 60 * 1000);
    return res.data;
  } catch (error) {
    console.error("Error fetching space news", error.message);
    throw error;
  }
};
