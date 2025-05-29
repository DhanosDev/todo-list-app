import { AxiosError } from "axios";
import api from "./api";
import { tokenService } from "./tokenService";
import { User } from "@/types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      createdAt: string;
    };
    token: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}

class AuthService {
  async register(userData: RegisterData): Promise<User> {
    try {
      const response = await api.post<AuthResponse>("/auth/register", userData);

      if (response.data.success) {
        const { user, token } = response.data.data;

        tokenService.setToken(token);
        tokenService.setUser(user);

        return user;
      } else {
        throw new Error(response.data.message ?? "Registration failed");
      }
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (
        error.response?.data?.errors &&
        error.response.data.errors.length > 0
      ) {
        throw new Error(error.response.data.errors[0]);
      }
      throw new Error(error.message ?? "Registration failed");
    }
  }

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);

      if (response.data.success) {
        const { user, token } = response.data.data;

        tokenService.setToken(token);
        tokenService.setUser(user);

        return user;
      } else {
        throw new Error(response.data.message ?? "Login failed");
      }
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message ?? "Login failed");
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<{
        success: boolean;
        data: {
          user: {
            id: string;
            name: string;
            email: string;
            createdAt: string;
            updatedAt: string;
          };
        };
      }>("/auth/me");

      if (response.data.success) {
        const user = response.data.data.user;

        tokenService.setUser(user);
        return user;
      } else {
        throw new Error("Failed to get user profile");
      }
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status === 401) {
        tokenService.clearAll();
      }
      throw new Error(error.message ?? "Failed to get user profile");
    }
  }

  async logout(): Promise<void> {
    try {
      tokenService.clearAll();
    } catch {
      tokenService.clearAll();
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      const token = tokenService.getToken();
      if (!token || tokenService.isTokenExpired()) {
        tokenService.clearAll();
        return false;
      }

      await this.getCurrentUser();
      return true;
    } catch {
      tokenService.clearAll();
      return false;
    }
  }

  isAuthenticated(): boolean {
    return tokenService.isAuthenticated();
  }

  getCurrentUserFromStorage(): User | null {
    return tokenService.getUser();
  }

  async refreshUserData(): Promise<User | null> {
    try {
      if (!this.isAuthenticated()) {
        return null;
      }
      return await this.getCurrentUser();
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      return null;
    }
  }
}

export const authService = new AuthService();
export default authService;
