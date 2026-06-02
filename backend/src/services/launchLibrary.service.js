const axios = require("axios");
const {
  findCachedListItem,
  getOrRefresh,
} = require("../utils/staleCache");

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const launchLibraryAPI = axios.create({
  baseURL: "https://ll.thespacedevs.com/2.3.0",
  timeout: 10000,
  headers: {
    "User-Agent": "Cosmovoid/1.0",
  },
});

launchLibraryAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status) {
      error.status = error.response.status;
    }
    if (error.response?.data?.detail) {
      error.message = error.response.data.detail;
    }
    throw error;
  },
);

const clampLimit = (limit, fallback = 20) => {
  const parsed = Number.parseInt(limit, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, 1), 100);
};

const cacheKey = (scope, params = {}) =>
  `${scope}:${JSON.stringify(Object.entries(params).sort())}`;

const fetchWithCache = ({ key, ttlMs, staleMs, fetcher }) =>
  getOrRefresh({
    key,
    source: "launch-library",
    ttlMs,
    staleMs,
    fetcher,
  });

const fetchList = async (endpoint, params, keyScope, ttlMs, staleMs) => {
  const key = cacheKey(keyScope, params);
  return fetchWithCache({
    key,
    ttlMs,
    staleMs,
    fetcher: async () => {
      const response = await launchLibraryAPI.get(endpoint, { params });
      return response.data;
    },
  });
};

exports.getUpcomingLaunches = async (query = {}) => {
  const params = {
    ...query,
    format: "json",
    hide_recent_previous: query.hide_recent_previous ?? true,
    limit: clampLimit(query.limit, 20),
    ordering: query.ordering || "net",
  };

  return fetchList(
    "/launches/upcoming/",
    params,
    "ll-upcoming-launches",
    10 * MINUTE,
    7 * DAY,
  );
};

exports.getPreviousLaunches = async (query = {}) => {
  const params = {
    ...query,
    format: "json",
    limit: clampLimit(query.limit, 20),
    ordering: query.ordering || "-net",
  };

  return fetchList(
    "/launches/previous/",
    params,
    "ll-previous-launches",
    6 * HOUR,
    30 * DAY,
  );
};

exports.getLaunchById = async (id) => {
  const key = `ll-launch:${id}`;
  try {
    return await fetchWithCache({
      key,
      ttlMs: 24 * HOUR,
      staleMs: 90 * DAY,
      fetcher: async () => {
        const response = await launchLibraryAPI.get(`/launches/${id}/`, {
          params: { format: "json" },
        });
        return response.data;
      },
    });
  } catch (error) {
    const cachedLaunch =
      (await findCachedListItem({ keyPrefix: "ll-upcoming-launches:", id })) ||
      (await findCachedListItem({ keyPrefix: "ll-previous-launches:", id }));

    if (cachedLaunch) return cachedLaunch;
    throw error;
  }
};

exports.getAstronauts = async (query = {}) => {
  const params = {
    ...query,
    format: "json",
    limit: clampLimit(query.limit, 40),
    ordering: query.ordering || "-time_in_space",
  };

  return fetchList(
    "/astronauts/",
    params,
    "ll-astronauts",
    24 * HOUR,
    30 * DAY,
  );
};

exports.getAstronautById = async (id) => {
  const key = `ll-astronaut:${id}`;
  try {
    return await fetchWithCache({
      key,
      ttlMs: 7 * DAY,
      staleMs: 90 * DAY,
      fetcher: async () => {
        const response = await launchLibraryAPI.get(`/astronauts/${id}/`, {
          params: { format: "json" },
        });
        return response.data;
      },
    });
  } catch (error) {
    const cachedAstronaut = await findCachedListItem({
      keyPrefix: "ll-astronauts:",
      id,
    });

    if (cachedAstronaut) return cachedAstronaut;
    throw error;
  }
};
