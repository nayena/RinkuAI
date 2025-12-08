// src/services/api.ts
import axios from "axios";
import { BASE_URL } from "../config";

console.log("[Rinku] Creating API client with base URL:", BASE_URL);

export const API = axios.create({ 
  baseURL: BASE_URL, 
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request/response logging for debugging
API.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('[API] Network error - is the backend running?');
      console.error('[API] Tried to connect to:', BASE_URL);
    } else {
      console.error('[API] Response error:', error.response?.status, error.message);
    }
    return Promise.reject(error);
  }
);
