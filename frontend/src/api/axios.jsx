import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5500/api",
  withCredentials: true,
});

export default api;
