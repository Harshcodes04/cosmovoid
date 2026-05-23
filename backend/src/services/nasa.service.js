const axios = require("axios");
const { getOrRefresh } = require("../utils/staleCache");

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

exports.getApod = () => {
  const date = new Date().toISOString().slice(0, 10);

  return getOrRefresh({
    key: `nasa-apod:${date}`,
    source: "nasa",
    ttlMs: DAY,
    staleMs: 30 * DAY,
    fetcher: async () => {
      const response = await axios.get("https://api.nasa.gov/planetary/apod", {
        params: { api_key: process.env.NASA_API_KEY || "DEMO_KEY" },
      });
      return response.data;
    },
  });
};

exports.getAsteroids = () => {
  const date = new Date().toISOString().slice(0, 10);

  return getOrRefresh({
    key: `nasa-asteroids:${date}`,
    source: "nasa",
    ttlMs: 6 * HOUR,
    staleMs: 7 * DAY,
    fetcher: async () => {
      const response = await axios.get("https://api.nasa.gov/neo/rest/v1/feed", {
        params: {
          start_date: date,
          end_date: date,
          api_key: process.env.NASA_API_KEY || "DEMO_KEY",
        },
      });
      return response.data;
    },
  });
};

exports.searchNasaMedia = (query, mediaType = "image") =>
  getOrRefresh({
    key: `nasa-media:${query}:${mediaType}`,
    source: "nasa-images",
    ttlMs: DAY,
    staleMs: 30 * DAY,
    fetcher: async () => {
      const response = await axios.get("https://images-api.nasa.gov/search", {
        params: { q: query, media_type: mediaType },
      });
      return response.data;
    },
  });

exports.getEarthEvents = () =>
  getOrRefresh({
    key: "nasa-eonet-events",
    source: "nasa",
    ttlMs: HOUR,
    staleMs: 7 * DAY,
    fetcher: async () => {
      const response = await axios.get("https://eonet.gsfc.nasa.gov/api/v3/events", {
        params: {
          status: "open",
          limit: 20,
          api_key: process.env.NASA_API_KEY || "DEMO_KEY",
        },
      });
      return response.data;
    },
  });
