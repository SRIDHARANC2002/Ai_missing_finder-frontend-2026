import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-missing-finder-backend-2026.vercel.app/api",
});

// Interceptor to add token to every request
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
