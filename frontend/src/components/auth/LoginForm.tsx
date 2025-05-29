"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button, Input, Card, LoadingSpinner } from "@/components/ui";
import { LoginCredentials } from "@/services/authService";

interface LoginFormData extends LoginCredentials {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function LoginForm({
  onSuccess,
  redirectTo = "/tasks",
}: LoginFormProps) {
  const { login, isLoading, error, clearError } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<LoginFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      await login(data);

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
      }

      reset();
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto" padding="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-preset-1 text-text-primary">Iniciar Sesión</h1>
          <p className="text-preset-5 text-text-secondary mt-2">
            Accede a tu cuenta para gestionar tus tareas
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-preset-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="tu@email.com"
            error={errors.email?.message}
            {...register("email", {
              required: "El correo electrónico es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Ingresa un correo electrónico válido",
              },
            })}
          />

          {/* Password Field */}
          <Input
            label="Contraseña"
            type="password"
            placeholder="Tu contraseña"
            error={errors.password?.message}
            {...register("password", {
              required: "La contraseña es requerida",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
            })}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary-large"
            disabled={!isValid || isLoading}
            fullWidth
          >
            {isLoading && <LoadingSpinner size="sm" color="white" />}
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-lines-light"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-surface text-text-secondary text-preset-6">
              ¿No tienes cuenta?
            </span>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <Link
            href="/register"
            className="text-main-purple hover:text-main-purple-hover text-preset-6 font-medium transition-colors"
          >
            Crear cuenta nueva
          </Link>
        </div>

        {/* Demo Credentials (for development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-preset-6 text-gray-600 mb-2">
              Demo credentials:
            </p>
            <p className="text-preset-6 text-gray-700">
              Email: test@todoapp.com
              <br />
              Password: Test123
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default LoginForm;
