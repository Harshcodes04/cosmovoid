const axios = require("axios");
const { getOrRefresh } = require("../utils/staleCache");

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const spacexAPI = axios.create({
  baseURL: "https://api.spacexdata.com/v4",
  timeout: 10000,
});

const cachedGet = ({ key, path, ttlMs, staleMs, errorMessage }) =>
  getOrRefresh({
    key,
    source: "spacex",
    ttlMs,
    staleMs,
    fetcher: async () => {
      try {
        const response = await spacexAPI.get(path);
        return response.data;
      } catch (error) {
        error.message = errorMessage;
        error.status = error.response?.status;
        throw error;
      }
    },
  });

exports.getLatestLaunch = () =>
  cachedGet({
    key: "spacex-latest-launch",
    path: "/launches/latest",
    ttlMs: HOUR,
    staleMs: 7 * DAY,
    errorMessage: "Failed to fetch latest SpaceX launch data",
  });

exports.getLaunchById = (id) =>
  cachedGet({
    key: `spacex-launch:${id}`,
    path: `/launches/${id}`,
    ttlMs: HOUR,
    staleMs: 30 * DAY,
    errorMessage: "Failed to fetch SpaceX launch data",
  });

exports.getUpcomingLaunches = () =>
  cachedGet({
    key: "spacex-upcoming-launches",
    path: "/launches/upcoming",
    ttlMs: HOUR,
    staleMs: 7 * DAY,
    errorMessage: "Failed to fetch upcoming SpaceX launch data",
  });

exports.getPastLaunches = () =>
  cachedGet({
    key: "spacex-past-launches",
    path: "/launches/past",
    ttlMs: 6 * HOUR,
    staleMs: 30 * DAY,
    errorMessage: "Failed to fetch past SpaceX launch data",
  });

exports.getRockets = () =>
  cachedGet({
    key: "spacex-rockets",
    path: "/rockets",
    ttlMs: DAY,
    staleMs: 90 * DAY,
    errorMessage: "Failed to fetch SpaceX rocket data",
  });

exports.getRocketById = (id) =>
  cachedGet({
    key: `spacex-rocket:${id}`,
    path: `/rockets/${id}`,
    ttlMs: DAY,
    staleMs: 90 * DAY,
    errorMessage: "Failed to fetch SpaceX rocket data",
  });

exports.getCrew = () =>
  cachedGet({
    key: "spacex-crew",
    path: "/crew",
    ttlMs: DAY,
    staleMs: 90 * DAY,
    errorMessage: "Failed to fetch crew data",
  });

exports.getCrewById = (id) =>
  cachedGet({
    key: `spacex-crew:${id}`,
    path: `/crew/${id}`,
    ttlMs: DAY,
    staleMs: 90 * DAY,
    errorMessage: "Failed to fetch SpaceX crew data",
  });

exports.getLaunchPads = () =>
  cachedGet({
    key: "spacex-launchpads",
    path: "/launchpads",
    ttlMs: DAY,
    staleMs: 90 * DAY,
    errorMessage: "Failed to fetch launch pad data",
  });

exports.getLandPads = () =>
  cachedGet({
    key: "spacex-landpads",
    path: "/landpads",
    ttlMs: DAY,
    staleMs: 90 * DAY,
    errorMessage: "Failed to fetch land pad data",
  });

exports.getRoadster = () =>
  cachedGet({
    key: "spacex-roadster",
    path: "/roadster",
    ttlMs: DAY,
    staleMs: 90 * DAY,
    errorMessage: "Failed to fetch roadster data",
  });
