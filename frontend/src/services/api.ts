import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { tokenService } from "./tokenService";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    tokenService.cleanupExpiredToken();

    const authHeader = tokenService.getAuthHeader();
    if (authHeader) {
      config.headers.Authorization = authHeader;
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`API Response: ${response.status} - ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          console.warn("Authentication failed - clearing tokens");
          tokenService.clearAll();

          if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            const isAuthPage =
              currentPath.includes("/login") ||
              currentPath.includes("/register");

            if (!isAuthPage) {
              window.location.href = "/login";
            }
          }
          break;

        case 403:
          console.warn("Access forbidden");
          break;

        case 404:
          console.warn("Resource not found:", error.config?.url);
          break;

        case 422:
          console.warn("Validation errors:", error.response.data);
          break;

        case 500:
          console.error("Server error:", error.response.data);
          break;

        default:
          console.error(`API Error ${status}:`, error.response.data);
      }
    } else if (error.request) {
      console.error("Network error:", error.message);
    } else {
      console.error("API Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export const apiHelpers = {
  async get<T>(url: string, config = {}) {
    try {
      const response = await api.get<T>(url, config);
      return response;
    } catch (error) {
      throw error;
    }
  },

  async post<T>(url: string, data = {}, config = {}) {
    try {
      const response = await api.post<T>(url, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  },

  async put<T>(url: string, data = {}, config = {}) {
    try {
      const response = await api.put<T>(url, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  },

  async delete<T>(url: string, config = {}) {
    try {
      const response = await api.delete<T>(url, config);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
