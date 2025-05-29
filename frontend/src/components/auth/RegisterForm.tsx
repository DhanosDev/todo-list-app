"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button, Input, Card, LoadingSpinner } from "@/components/ui";
import { RegisterData } from "@/services/authService";

interface RegisterFormData extends RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function RegisterForm({
  onSuccess,
  redirectTo = "/tasks",
}: RegisterFormProps) {
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<RegisterFormData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchPassword = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      clearError();

      const { name, email, password } = data;
      await registerUser({ name, email, password });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
      }

      reset();
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto" padding="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-preset-1 text-text-primary">Crear Cuenta</h1>
          <p className="text-preset-5 text-text-secondary mt-2">
            Únete para empezar a organizar tus tareas
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
          {/* Name Field */}
          <Input
            label="Nombre completo"
            type="text"
            placeholder="Tu nombre"
            error={errors.name?.message}
            {...register("name", {
              required: "El nombre es requerido",
              minLength: {
                value: 2,
                message: "El nombre debe tener al menos 2 caracteres",
              },
              maxLength: {
                value: 50,
                message: "El nombre no puede exceder 50 caracteres",
              },
              pattern: {
                value: /^[a-zA-ZÀ-ÿ\s]+$/,
                message: "El nombre solo puede contener letras y espacios",
              },
            })}
          />

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
            placeholder="Mínimo 6 caracteres"
            error={errors.password?.message}
            {...register("password", {
              required: "La contraseña es requerida",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
                message:
                  "La contraseña debe incluir mayúscula, minúscula y número",
              },
            })}
          />

          {/* Confirm Password Field */}
          <Input
            label="Confirmar contraseña"
            type="password"
            placeholder="Repite tu contraseña"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              required: "Confirma tu contraseña",
              validate: (value) =>
                value === watchPassword || "Las contraseñas no coinciden",
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
            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>
        </form>

        {/* Terms Notice */}
        <p className="text-preset-6 text-text-secondary text-center">
          Al crear una cuenta, aceptas nuestros{" "}
          <Link
            href="/terms"
            className="text-main-purple hover:text-main-purple-hover"
          >
            términos de servicio
          </Link>{" "}
          y{" "}
          <Link
            href="/privacy"
            className="text-main-purple hover:text-main-purple-hover"
          >
            política de privacidad
          </Link>
        </p>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-lines-light"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-surface text-text-secondary text-preset-6">
              ¿Ya tienes cuenta?
            </span>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <Link
            href="/login"
            className="text-main-purple hover:text-main-purple-hover text-preset-6 font-medium transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </Card>
  );
}

export default RegisterForm;
