const axios = require("axios");
const cache = require("../utils/cache");

const spacexAPI = axios.create({
  baseURL: "https://api.spacexdata.com/v4",
});

exports.getRockets = async () => {
  const cached = await cache.get("spacex-rockets");
  if (cached) {
    return cached;
  }
  try {
    const response = await spacexAPI.get("/rockets");
    //well this sets it for 24 hours because it barely changes
    cache.set("spacex-rockets", response.data, 24 * 60 * 60 * 1000);
    return response.data;
  } catch {
    throw new Error("Failed to fetch SpaceX rocket data");
  }
};

exports.getRocketById = async (id) => {
  const cacheKey = `rocket-${id}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;
  try {
    const response = await spacexAPI.get(`/rockets/${id}`);
    cache.set(cacheKey, response.data, 60 * 60 * 1000);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch SpaceX rocket data");
  }
};

exports.getLaunchPads = async () => {
  const cached = await cache.get("spacex-launchpads");
  if (cached) {
    return cached;
  }
  try {
    const response = await spacexAPI.get("/launchpads");
    //well this sets it for 24 hours because it barely changes
    cache.set("spacex-launchpads", response.data, 24 * 60 * 60 * 1000);
    return response.data;
  } catch {
    throw new Error("Failed to fetch launch pad data");
  }
};

exports.getLandPads = async () => {
  const cached = await cache.get("spacex-landpads");
  if (cached) {
    return cached;
  }
  try {
    const response = await spacexAPI.get("/landpads");
    //well this sets it for 24 hours because it barely changes
    cache.set("spacex-landpads", response.data, 24 * 60 * 60 * 1000);
    return response.data;
  } catch {
    throw new Error("Failed to fetch land pad data");
  }
};

exports.getRoadster = async () => {
  const cached = await cache.get("spacex-roadster");
  if (cached) {
    return cached;
  }
  try {
    const response = await spacexAPI.get("/roadster");
    //well this sets it for 24 hours because it barely changes
    cache.set("spacex-roadster", response.data, 24 * 60 * 60 * 1000);
    return response.data;
  } catch {
    throw new Error("Failed to fetch roadster data");
  }
};
