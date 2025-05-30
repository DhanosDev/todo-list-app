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
          <p className="text-body-l text-text-secondary mt-4">
            Cargando perfil...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-heading-m text-text-primary mb-2">
            Error al cargar perfil
          </h2>
          <p className="text-body-l text-text-secondary">
            No se pudo obtener la información del usuario
          </p>
          <Button
            variant="primary-large"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </Button>
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

  // Generar color determinístico basado en el nombre del usuario
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-main-purple",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    const index = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header mejorado con gradiente */}
      <div className="bg-gradient-to-r from-main-purple to-main-purple-hover text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-6">
            <div
              className={`w-20 h-20 ${getAvatarColor(
                userName
              )} rounded-full flex items-center justify-center shadow-lg border-4 border-white`}
            >
              <span className="text-heading-l font-bold text-white">
                {userInitial}
              </span>
            </div>
            <div>
              <h1 className="text-heading-xl font-bold">{userName}</h1>
              <p className="text-body-l opacity-90 mt-1">{userEmail}</p>
              <p className="text-body-m opacity-75 mt-1">
                Miembro {memberSince}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información del Perfil */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Personal */}
            <Card
              padding="lg"
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-heading-m font-medium text-text-primary">
                    Información Personal
                  </h2>
                  <div className="flex items-center space-x-2 text-body-m text-text-secondary">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Solo visible para ti
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-heading-s font-medium text-text-primary">
                      Nombre completo
                    </label>
                    <div className="px-4 py-3 bg-background border border-lines-light rounded-lg text-body-l text-text-primary hover:border-main-purple transition-colors">
                      {userName}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-heading-s font-medium text-text-primary">
                      Correo electrónico
                    </label>
                    <div className="px-4 py-3 bg-background border border-lines-light rounded-lg text-body-l text-text-primary hover:border-main-purple transition-colors">
                      {userEmail}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-heading-s font-medium text-text-primary">
                      ID de usuario
                    </label>
                    <div className="px-4 py-3 bg-background border border-lines-light rounded-lg text-body-m text-text-secondary font-mono">
                      {userId.slice(0, 8)}...{userId.slice(-4)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-heading-s font-medium text-text-primary">
                      Fecha de registro
                    </label>
                    <div className="px-4 py-3 bg-background border border-lines-light rounded-lg text-body-l text-text-primary">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "No disponible"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-lines-light">
                  <Button
                    variant="primary-large"
                    disabled
                    className="flex-1 sm:flex-none"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Editar Perfil
                  </Button>
                  <Button
                    variant="secondary"
                    disabled
                    className="flex-1 sm:flex-none"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Cambiar Contraseña
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-blue-400 mt-0.5 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h4 className="text-body-l font-medium text-blue-800">
                        Próximamente
                      </h4>
                      <p className="text-body-m text-blue-700 mt-1">
                        Podrás editar tu perfil y cambiar tu contraseña. Estamos
                        trabajando en estas funcionalidades.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Preferencias */}
            <Card
              padding="lg"
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-6">
                <h2 className="text-heading-m font-medium text-text-primary">
                  Preferencias
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-heading-s font-medium text-text-primary">
                      Tema de la aplicación
                    </label>
                    <div className="px-4 py-3 bg-background border border-lines-light rounded-lg text-body-l text-text-secondary">
                      Claro (por defecto)
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-heading-s font-medium text-text-primary">
                      Idioma
                    </label>
                    <div className="px-4 py-3 bg-background border border-lines-light rounded-lg text-body-l text-text-secondary">
                      Español
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar de Estadísticas */}
          <div className="lg:col-span-1 space-y-6">
            {/* Estadísticas Rápidas */}
            <Card
              padding="lg"
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-main-purple"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <h3 className="text-heading-m font-medium text-text-primary">
                    Estadísticas
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-lines-light">
                    <span className="text-body-l text-text-secondary">
                      Tareas creadas
                    </span>
                    <span className="text-heading-s font-bold text-text-primary">
                      -
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-body-l text-green-700">
                      Tareas completadas
                    </span>
                    <span className="text-heading-s font-bold text-green-600">
                      -
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <span className="text-body-l text-purple-700">
                      Tasa de completitud
                    </span>
                    <span className="text-heading-s font-bold text-main-purple">
                      -%
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-body-l text-blue-700">
                      Subtareas pendientes
                    </span>
                    <span className="text-heading-s font-bold text-blue-600">
                      -
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-lines-light">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <svg
                        className="w-4 h-4 text-yellow-400 mt-0.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="text-body-m font-medium text-yellow-800">
                          En desarrollo
                        </p>
                        <p className="text-body-m text-yellow-700 mt-1">
                          Las estadísticas se calcularán automáticamente basadas
                          en tu actividad.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
