import axios from "axios";

const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:5001";

const api = axios.create({
  baseURL: `${API_ROOT}/api`,
});

export default api;