import { User } from "@/types";

const TOKEN_KEY = "todo_app_token";
const USER_KEY = "todo_app_user";

class TokenService {
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): User | null {
    const userData = localStorage.getItem(USER_KEY);
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      this.removeUser();
      return null;
    }
  }

  removeUser(): void {
    localStorage.removeItem(USER_KEY);
  }

  clearAll(): void {
    this.removeToken();
    this.removeUser();
  }

  isTokenExpired(token?: string): boolean {
    const tokenToCheck = token || this.getToken();
    if (!tokenToCheck) return true;

    try {
      const payload = JSON.parse(atob(tokenToCheck.split(".")[1]));
      const currentTime = Date.now() / 1000;

      return payload.exp < currentTime;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();

    return !!(token && user && !this.isTokenExpired(token));
  }

  getAuthHeader(): string | null {
    const token = this.getToken();
    return token ? `Bearer ${token}` : null;
  }

  cleanupExpiredToken(): void {
    if (this.getToken() && this.isTokenExpired()) {
      this.clearAll();
    }
  }
}

export const tokenService = new TokenService();
export default tokenService;
