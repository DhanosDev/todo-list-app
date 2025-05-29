"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Component that protects routes requiring authentication
 *
 * @param children - Content to render if authenticated
 * @param fallback - Content to render while loading (optional)
 * @param redirectTo - Where to redirect if not authenticated (default: '/login')
 *
 * @example
 * ```tsx
 *
 * export default function DashboardPage() {
 *   return (
 *     <ProtectedRoute>
 *       <Dashboard />
 *     </ProtectedRoute>
 *   );
 * }
 *
 *
 * <ProtectedRoute fallback={<CustomLoader />}>
 *   <Dashboard />
 * </ProtectedRoute>
 * ```
 */
export function ProtectedRoute({
  children,
  fallback,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, isInitializing } = useAuthStatus();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      console.log("User not authenticated, redirecting to:", redirectTo);
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

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Higher-order component version of ProtectedRoute
 *
 * @param Component - Component to wrap
 * @param options - Protection options
 *
 * @example
 * ```tsx
 * const ProtectedDashboard = withAuth(Dashboard);
 *
 *
 * <ProtectedDashboard />
 * ```
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, "children"> = {}
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

export default ProtectedRoute;
