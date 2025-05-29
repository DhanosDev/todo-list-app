"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  authService,
  LoginCredentials,
  RegisterData,
} from "@/services/authService";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;

  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;

  clearError: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && authService.isAuthenticated();

  const clearError = () => setError(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsInitializing(true);

        const storedUser = authService.getCurrentUserFromStorage();

        if (storedUser && authService.isAuthenticated()) {
          const isValid = await authService.validateToken();

          if (isValid) {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const userData = await authService.login(credentials);
      setUser(userData);

      console.log("Login successful:", userData.name);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);

      const newUser = await authService.register(userData);
      setUser(newUser);

      console.log("Registration successful:", newUser.name);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      await authService.logout();
      setUser(null);
      setError(null);

      console.log("Logout successful");
    } catch (err) {
      console.error("Logout error:", err);

      setUser(null);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      if (!isAuthenticated) return;

      setIsLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error("Refresh user error:", err);

      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    isInitializing,
    error,

    login,
    register,
    logout,
    refreshUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export { AuthContext };
export type { AuthContextType };
