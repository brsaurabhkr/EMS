import axios from "axios";

const api = axios.create({
  // Leave this unset for local development; Vite will proxy /api to localhost:5000.
  // Set VITE_API_URL after deploying the backend, for example https://api.example.com.
  baseURL: import.meta.env.VITE_API_URL || "",
});

export default api;
