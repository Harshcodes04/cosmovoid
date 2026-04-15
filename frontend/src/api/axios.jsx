import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5500/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
