const axios = require("axios");
const cache = require("../utils/cache");

const spacexAPI = axios.create({
  baseURL: "https://api.spacexdata.com/v4",
});

exports.getLatestLaunchs = async () => {
  const cached = cache.get("spacex-latest-launch");

  if (cached) {
    return cached;
  }
  try {
    const response = await spacexAPI.get("/launches/latest");
    //well this sets it for 1 hour
    cache.set("spacex-latest-launch", response.data, 60 * 60 * 1000);
    return response.data;
  } catch {
    throw new Error("Failed to fetch latest SpaceX launch data");
  }
};

exports.getUpcomingLaunches = async () => {
  const cached = cache.get("spacex-upcoming-launches");
  if (cached) {
    return cached;
  }
  try {
    const response = await spacexAPI.get("/launches/upcoming");
    //well this sets it for 1 hour as well
    cache.set("spacex-upcoming-launches", response.data, 60 * 60 * 1000);
    return response.data;
  } catch {
    throw new Error("Failed to fetch upcoming SpaceX launch data");
  }
};

exports.getPastLaunches = async () => {
  const cached = cache.get("spacex-past-launches");
  if (cached) {
    return cached;
  }
  try {
    const response = await spacexAPI.get("/launches/past");
    //well this sets it for 1 hour as well
    cache.set("spacex-past-launches", response.data, 60 * 60 * 1000);
    return response.data;
  } catch {
    throw new Error("Failed to fetch past SpaceX launch data");
  }
};

exports.getRockets = async () => {
  const cached = cache.get("spacex-rockets");
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

exports.getCrew = async () => {
  const cached = cache.get("spacex-crew");
  if (cached) {
    return cached;
  }
  try {
    const response = await spacexAPI.get("/crew");
    //well this sets it for 24 hours because it barely changes
    cache.set("spacex-crew", response.data, 24 * 60 * 60 * 1000);
    return response.data;
  } catch {
    throw new Error("Failed to fetch crew data");
  }
};

exports.getLaunchPads = async () => {
  const cached = cache.get("spacex-launchpads");
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
  const cached = cache.get("spacex-landpads");
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
  const cached = cache.get("spacex-roadster");
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
