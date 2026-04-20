import api from "./axios";

export const getApod = () => api.get("/space/apod");
export const getNews = () => api.get("/space/news");
export const getAsteroids = () => api.get("/space/asteroids");
export const getJournalEntries = () => api.get("/journal");
