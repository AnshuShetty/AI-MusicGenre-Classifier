// src/api.js
import axios from "axios";
import { logout } from "./auth"; // you'll create this next

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // required for cookie-based JWT
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      logout();
    }
    return Promise.reject(error);
  }
);

export default api;
