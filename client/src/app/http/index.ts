import axios from "axios";

export const $api = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_APP_API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
  return config;
});
