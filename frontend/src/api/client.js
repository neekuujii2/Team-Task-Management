import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Debug: Log the API URL being used
console.log("🔗 API URL:", API_BASE_URL);
console.log("🔗 VITE_API_URL env:", import.meta.env.VITE_API_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
