"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth";
import { Button, LoadingSpinner } from "@/components/ui";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      toast.success("Sesión cerrada exitosamente");
      router.push("/login");
    } catch (error) {
      toast.error("Error al cerrar sesión");
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Top Navigation */}
        <nav className="bg-surface border-b border-lines-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo/Brand */}
              <div className="flex items-center space-x-4">
                <h1 className="text-preset-2 font-bold text-main-purple">
                  📋 TodoApp
                </h1>
                <div className="hidden sm:block w-px h-6 bg-lines-light"></div>
                <span className="hidden sm:block text-preset-5 text-text-secondary">
                  Dashboard
                </span>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-6">
                <a
                  href="/tasks"
                  className="text-preset-5 text-text-primary hover:text-main-purple transition-colors font-medium"
                >
                  Mis Tareas
                </a>
                <a
                  href="/profile"
                  className="text-preset-5 text-text-secondary hover:text-main-purple transition-colors"
                >
                  Perfil
                </a>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                {/* User Info */}
                {user && (
                  <div className="hidden sm:block text-right">
                    <p className="text-preset-6 font-medium text-text-primary">
                      {user.name}
                    </p>
                    <p className="text-preset-6 text-text-secondary">
                      {user.email}
                    </p>
                  </div>
                )}

                {/* Logout Button */}
                <Button
                  variant="secondary"
                  onClick={handleLogout}
                  disabled={isLoading || isLoggingOut}
                >
                  {isLoggingOut && <LoadingSpinner size="sm" />}
                  {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-surface border-t border-lines-light mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <p className="text-preset-6 text-text-secondary">
                © 2025 TodoApp. Organiza tus tareas de manera eficiente.
              </p>
              <div className="flex items-center space-x-4">
                <a
                  href="/terms"
                  className="text-preset-6 text-text-secondary hover:text-main-purple transition-colors"
                >
                  Términos
                </a>
                <a
                  href="/privacy"
                  className="text-preset-6 text-text-secondary hover:text-main-purple transition-colors"
                >
                  Privacidad
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
