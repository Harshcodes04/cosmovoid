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
