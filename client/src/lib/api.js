import axios from "axios";
import ErrorCodes from "./error-codes";
import store from "../state/store";
import { logoutSuccess } from "../state/userSlice";

const API_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Response interceptor - logout if token is invalid/expired
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.data?.code === ErrorCodes.INVALID_TOKEN) {
      localStorage.removeItem("accessToken");
      store.dispatch(logoutSuccess());
    }
    return Promise.reject(err);
  }
);

export default api;
