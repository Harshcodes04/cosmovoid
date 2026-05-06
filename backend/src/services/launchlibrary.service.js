const axios = require("axios");
const cache = require("../utils/cache");
const ll2 = axios.create({
  // Dev: lldev.thespacedevs.com (higher rate limits for development)
  // Prod: ll.thespacedevs.com
  baseURL: process.env.NODE_ENV === "production"
    ? "https://ll.thespacedevs.com/2.2.0"
    : "https://lldev.thespacedevs.com/2.2.0",
  timeout: 15000,
});

exports.getUpcomingGlobalLaunches = async (limit = 20) => {
  const key = `ll2-upcoming-${limit}`;
  const cached = await cache.get(key);    
  if (cached) return cached;
  try {
    const { data } = await ll2.get("/launch/upcoming/", {
      params: { limit, ordering: "net", format: "json" },
    });
    cache.set(key, data, 30 * 60 * 1000); // 30 min
    return data;
  } catch (err) {
    const stale = await cache.getStale(key);
    if (stale) return stale;
    throw new Error("Failed to fetch global upcoming launches: " + err.message);
  }
};

exports.getPreviousGlobalLaunches = async (limit = 20) => {
  const key = `ll2-previous-${limit}`;
  const cached = await cache.get(key);
  if (cached) return cached;
  try {
    const { data } = await ll2.get("/launch/previous/", {
      params: { limit, ordering: "-net", format: "json" },
    });
    cache.set(key, data, 60 * 60 * 1000);
    return data;
  } catch (err) {
    const stale = await cache.getStale(key);
    if (stale) return stale;
    throw new Error("Failed to fetch global previous launches: " + err.message);
  }
};

exports.getGlobalLaunchById = async (id) => {
  const key = `ll2-launch-${id}`;
  const cached = await cache.get(key);
  if (cached) return cached;
  try {
    const { data } = await ll2.get(`/launch/${id}/`, { params: { format: "json" } });
    cache.set(key, data, 60 * 60 * 1000);
    return data;
  } catch (err) {
    const stale = await cache.getStale(key);
    if (stale) return stale;
    throw new Error("Failed to fetch global launch: " + err.message);
  }
};

exports.getAstronauts = async (limit = 25, filters = {}) => {
  const paramStr = JSON.stringify({ limit, ...filters });
  const key = `ll2-astronauts-${paramStr}`;
  const cached = await cache.get(key);
  if (cached) return cached;
  try {
    const { data } = await ll2.get("/astronaut/", {
      params: { limit, ordering: "-last_flight", format: "json", ...filters },
    });
    cache.set(key, data, 60 * 60 * 1000);
    return data;
  } catch (err) {
    const stale = await cache.getStale(key);
    if (stale) return stale;
    throw new Error("Failed to fetch astronauts: " + err.message);
  }
};

exports.getAstronautById = async (id) => {
  const key = `ll2-astronaut-${id}`;
  const cached = await cache.get(key);
  if (cached) return cached;
  try {
    const { data } = await ll2.get(`/astronaut/${id}/`, { params: { format: "json" } });
    cache.set(key, data, 24 * 60 * 60 * 1000);
    return data;
  } catch (err) {
    const stale = await cache.getStale(key);
    if (stale) return stale;
    throw new Error("Failed to fetch astronaut: " + err.message);
  }
};
