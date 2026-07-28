import axios from "axios";

const api = axios.create({
  // Vite proxies this path locally. In production set VITE_API_URL to the backend URL.
  baseURL: import.meta.env.VITE_API_URL || "",
});

export default api;
