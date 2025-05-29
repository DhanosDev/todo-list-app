import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { tokenService } from "./tokenService";

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Clean up expired tokens before making requests
    tokenService.cleanupExpiredToken();

    // Add auth header if token exists
    const authHeader = tokenService.getAuthHeader();
    if (authHeader) {
      config.headers.Authorization = authHeader;
    }

    // Log request in development
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

// Response interceptor - Handle auth errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === "development") {
      console.log(`API Response: ${response.status} - ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle different types of errors
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear auth data and redirect to login
          console.warn("Authentication failed - clearing tokens");
          tokenService.clearAll();

          // Only redirect if we're not already on auth pages
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
          // Forbidden - user doesn't have permission
          console.warn("Access forbidden");
          break;

        case 404:
          // Not found
          console.warn("Resource not found:", error.config?.url);
          break;

        case 422:
          // Validation errors
          console.warn("Validation errors:", error.response.data);
          break;

        case 500:
          // Server error
          console.error("Server error:", error.response.data);
          break;

        default:
          console.error(`API Error ${status}:`, error.response.data);
      }
    } else if (error.request) {
      // Network error
      console.error("Network error:", error.message);
    } else {
      // Other error
      console.error("API Error:", error.message);
    }

    return Promise.reject(error);
  }
);

// Helper functions for common request patterns
export const apiHelpers = {
  // Get with error handling
  async get<T>(url: string, config = {}) {
    try {
      const response = await api.get<T>(url, config);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Post with error handling
  async post<T>(url: string, data = {}, config = {}) {
    try {
      const response = await api.post<T>(url, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Put with error handling
  async put<T>(url: string, data = {}, config = {}) {
    try {
      const response = await api.put<T>(url, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete with error handling
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
