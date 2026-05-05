const axios = require("axios");
const cache = require("../utils/cache");

exports.getApod = async () => {
  const cacheKey = `apod-${new Date().toISOString().slice(0, 10)}`;

  try {
    const cachedData = await cache.get(cacheKey);
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

exports.getAsteroids = async () => {
  const date = new Date().toISOString().slice(0, 10);
  const cacheKey = `asteroids-${date}`;
  const cachedData = await cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  try {
    const response = await axios.get("https://api.nasa.gov/neo/rest/v1/feed", {
      params: {
        start_date: date,
        end_date: date,
        api_key: process.env.NASA_API_KEY,
      },
    });
    cache.set(cacheKey, response.data, 24 * 60 * 60 * 1000);
    return response.data;
  } catch (error) {
    console.error("Full error", error.message);
    throw error;
  }
};

exports.searchNasaMedia = async (query, mediaType = "image") => {
  const cacheKey = `nasa-media-${query}-${mediaType}`;
  const cachedData = await cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  try {
    const res = await fetch(
      `https://images-api.nasa.gov/search?q=${query}&media_type=${mediaType}`,
    );
    if (!res.ok) throw new Error(`NASA API error: ${res.status}`);
    const data = await res.json();
    cache.set(cacheKey, data, 60 * 60 * 1000);
    return data;
  } catch (error) {
    console.error("Full error", error.message);
    throw error;
  }
};

exports.getEarthEvents = async () => {
  const cached = await cache.get("eonet-events");
  if (cached) return cached;

  const response = await axios.get("https://eonet.gsfc.nasa.gov/api/v3/events", {
    params: {
      status: "open",
      limit: 20,
      api_key: process.env.NASA_API_KEY
    }
  });

  cache.set("eonet-events", response.data, 60 * 60 * 1000); // 1 hour
  return response.data;
};

//Insight/Mars Weather (later)
