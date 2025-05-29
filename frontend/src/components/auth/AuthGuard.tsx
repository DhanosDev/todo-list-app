"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Component that redirects authenticated users away from auth pages
 * Use this on login/register pages to prevent logged-in users from accessing them
 *
 * @param children - Content to render if NOT authenticated
 * @param fallback - Content to render while loading (optional)
 * @param redirectTo - Where to redirect if authenticated (default: '/tasks')
 *
 * @example
 * ```tsx
 * // Login page
 * export default function LoginPage() {
 *   return (
 *     <AuthGuard>
 *       <LoginForm />
 *     </AuthGuard>
 *   );
 * }
 *
 * // With custom redirect
 * <AuthGuard redirectTo="/dashboard">
 *   <RegisterForm />
 * </AuthGuard>
 * ```
 */
export function AuthGuard({
  children,
  fallback,
  redirectTo = "/tasks",
}: AuthGuardProps) {
  const { isAuthenticated, isInitializing } = useAuthStatus();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      console.log("User already authenticated, redirecting to:", redirectTo);
      router.push(redirectTo);
    }
  }, [isAuthenticated, isInitializing, router, redirectTo]);

  if (isInitializing) {
    return (
      fallback ?? (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      )
    );
  }

  //
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Higher-order component version of AuthGuard
 *
 * @param Component - Component to wrap (usually auth forms)
 * @param options - Guard options
 *
 * @example
 * ```tsx
 * const GuardedLogin = withAuthGuard(LoginForm);
 *
 * // Usage
 * <GuardedLogin />
 * ```
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<AuthGuardProps, "children"> = {}
) {
  return function GuardedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}

export default AuthGuard;
