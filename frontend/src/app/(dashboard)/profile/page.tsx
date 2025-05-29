"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, Button, LoadingSpinner } from "@/components/ui";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-preset-5 text-text-secondary mt-4">
            Cargando perfil...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-preset-3 text-text-primary mb-2">
            Error al cargar perfil
          </p>
          <p className="text-preset-5 text-text-secondary">
            No se pudo obtener la información del usuario
          </p>
        </div>
      </div>
    );
  }

  const memberSince = user.createdAt
    ? formatDistanceToNow(new Date(user.createdAt), {
        locale: es,
        addSuffix: true,
      })
    : "Fecha no disponible";

  const userName = user.name || "Usuario";
  const userEmail = user.email || "Email no disponible";
  const userId = user.id || "ID no disponible";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-lines-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-preset-1 font-bold text-text-primary">
            Mi Perfil
          </h1>
          <p className="text-preset-5 text-text-secondary mt-1">
            Gestiona tu información personal
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card padding="lg">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-main-purple rounded-full flex items-center justify-center">
                    <span className="text-preset-1 font-bold text-white">
                      {userInitial}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-preset-2 font-medium text-text-primary">
                      {userName}
                    </h2>
                    <p className="text-preset-5 text-text-secondary">
                      {userEmail}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-preset-4 font-medium text-text-primary mb-2">
                      Nombre completo
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-lines-light rounded-lg text-preset-5 text-text-primary">
                      {userName}
                    </div>
                  </div>

                  <div>
                    <label className="block text-preset-4 font-medium text-text-primary mb-2">
                      Correo electrónico
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-lines-light rounded-lg text-preset-5 text-text-primary">
                      {userEmail}
                    </div>
                  </div>

                  <div>
                    <label className="block text-preset-4 font-medium text-text-primary mb-2">
                      ID de usuario
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-lines-light rounded-lg text-preset-6 text-text-secondary">
                      {userId}
                    </div>
                  </div>

                  <div>
                    <label className="block text-preset-4 font-medium text-text-primary mb-2">
                      Miembro desde
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-lines-light rounded-lg text-preset-5 text-text-primary">
                      {memberSince}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-lines-light">
                  <Button variant="primary-large" disabled>
                    Editar Perfil
                  </Button>
                  <Button variant="secondary" disabled>
                    Cambiar Contraseña
                  </Button>
                </div>

                <p className="text-preset-6 text-text-secondary">
                  💡 <strong>Próximamente:</strong> Podrás editar tu perfil y
                  cambiar tu contraseña.
                </p>
              </div>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <Card padding="lg">
              <div className="space-y-6">
                <h3 className="text-preset-3 font-medium text-text-primary">
                  Estadísticas
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-preset-5 text-text-secondary">
                      Tareas creadas
                    </span>
                    <span className="text-preset-4 font-medium text-text-primary">
                      -
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-preset-5 text-text-secondary">
                      Tareas completadas
                    </span>
                    <span className="text-preset-4 font-medium text-main-purple">
                      -
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-preset-5 text-text-secondary">
                      Tasa de completitud
                    </span>
                    <span className="text-preset-4 font-medium text-green-600">
                      -%
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-lines-light">
                  <p className="text-preset-6 text-text-secondary">
                    💡 <strong>Próximamente:</strong> Estadísticas detalladas de
                    tu productividad.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
