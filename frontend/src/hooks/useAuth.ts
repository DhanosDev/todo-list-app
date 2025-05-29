import { useContext } from "react";
import { AuthContext, AuthContextType } from "@/contexts/AuthContext";

/**
 * Custom hook to access authentication context
 *
 * @returns AuthContextType - All auth state and methods
 * @throws Error if used outside AuthProvider
 *
 * @example
 * ```tsx
 * function LoginButton() {
 *   const { login, isLoading, error } = useAuth();
 *
 *   const handleLogin = async () => {
 *     try {
 *       await login({ email: 'user@example.com', password: 'password' });
 *       // Login successful
 *     } catch (error) {
 *       // Handle error (already set in context)
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleLogin} disabled={isLoading}>
 *       {isLoading ? 'Logging in...' : 'Login'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider. " +
        "Make sure your component is wrapped in <AuthProvider>."
    );
  }

  return context;
}

/**
 * Hook to get only authentication status (lighter alternative)
 *
 * @returns Object with basic auth info
 *
 * @example
 * ```tsx
 * function ProtectedComponent() {
 *   const { isAuthenticated, isInitializing } = useAuthStatus();
 *
 *   if (isInitializing) return <LoadingSpinner />;
 *   if (!isAuthenticated) return <LoginForm />;
 *
 *   return <Dashboard />;
 * }
 * ```
 */
export function useAuthStatus() {
  const { isAuthenticated, isInitializing, user } = useAuth();

  return {
    isAuthenticated,
    isInitializing,
    user,
  };
}

/**
 * Hook to get auth actions only (for forms)
 *
 * @returns Object with auth actions and loading state
 *
 * @example
 * ```tsx
 * function LoginForm() {
 *   const { login, register, isLoading, error, clearError } = useAuthActions();
 *
 *   // Use in form handlers
 * }
 * ```
 */
export function useAuthActions() {
  const { login, register, logout, refreshUser, isLoading, error, clearError } =
    useAuth();

  return {
    login,
    register,
    logout,
    refreshUser,
    isLoading,
    error,
    clearError,
  };
}

export default useAuth;
