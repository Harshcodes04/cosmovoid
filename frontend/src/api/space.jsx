import api from "./axios";

export const getApod = () => api.get("/space/apod");
export const getNews = () => api.get("/space/news");
export const getAsteroids = () => api.get("/space/asteroids");
export const getLatestLaunch = () => api.get("/space/launches/latest");
export const getUpcomingLaunches = () => api.get("/space/launches/upcoming");
export const getRockets = () => api.get("/space/rockets");
export const getRocketById = (id) => api.get(`/space/rockets/${id}`);
export const getJournalEntries = () => api.get("/journal");
export const getJournalEntryById = (id) => api.get(`/journal/${id}`);
export const createJournalEntry = (payload) => api.post("/journal", payload);
export const updateJournalEntry = (id, payload) => api.put(`/journal/${id}`, payload);
export const deleteJournalEntry = (id) => api.delete(`/journal/${id}`);
export const getGlobalUpcomingLaunches = (limit = 20) =>
  api.get("/space/global/launches/upcoming", { params: { limit } });
export const getGlobalPreviousLaunches = (limit = 20) =>
  api.get("/space/global/launches/previous", { params: { limit } });
export const getGlobalLaunchById = (id) =>
  api.get(`/space/global/launches/${id}`);
export const getAstronauts = (params = {}) =>
  api.get("/space/astronauts", { params });
export const getAstronautById = (id) => api.get(`/space/astronauts/${id}`);
export const searchNasaMedia = (query, mediaType = "image", page = 1) =>
  api.get("/space/media/search", { params: { query, mediaType, page } });

export const getSkyEvents = () => api.get("/space/events/sky");

export const sendOtp       = (email, username)      => api.post("/auth/send-otp",       { email, username });
export const verifyOtp     = (email, otp)           => api.post("/auth/verify-otp",      { email, otp });
export const forgotPassword = (email)               => api.post("/auth/forgot-password", { email });
export const resetPassword  = (email, otp, newPassword) => api.post("/auth/reset-password", { email, otp, newPassword });
