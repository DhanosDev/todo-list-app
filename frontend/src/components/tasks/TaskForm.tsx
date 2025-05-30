"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Task } from "@/types";
import { Button, Input, Card, LoadingSpinner } from "@/components/ui";
import { CreateTaskData } from "@/services/taskService";

interface TaskFormData {
  title: string;
  description: string;
}

interface TaskFormProps {
  mode: "create" | "edit";
  initialData?: Task;
  parentTask?: Task;
  onSubmit: (data: CreateTaskData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function TaskForm({
  mode,
  initialData,
  parentTask,
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<TaskFormData>({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Watch para contadores de caracteres
  const titleValue = watch("title", "");
  const descriptionValue = watch("description", "");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setValue("title", initialData.title);
      setValue("description", initialData.description);
    }
  }, [mode, initialData, setValue]);

  const handleFormSubmit = async (data: TaskFormData) => {
    try {
      const taskData: CreateTaskData = {
        title: data.title,
        description: data.description,
        ...(parentTask && { parentTask: parentTask._id }),
      };

      await onSubmit(taskData);

      if (mode === "create") {
        reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const getFormTitle = () => {
    if (mode === "edit") return "Editar tarea";
    if (parentTask) return `Nueva subtarea para: ${parentTask.title}`;
    return "Nueva tarea";
  };

  return (
    <Card padding="lg" className="w-full max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-heading-l font-semibold text-text-primary">
            {getFormTitle()}
          </h2>

          {/* Close button */}
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>

        {/* Parent task info */}
        {parentTask && (
          <div className="bg-surface rounded-lg p-4 border-l-4 border-main-purple">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-main-purple rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-body-m text-text-secondary mb-1">
                  Subtarea de:
                </p>
                <p className="text-body-l font-medium text-text-primary">
                  {parentTask.title}
                </p>
                {parentTask.description && (
                  <p className="text-body-m text-text-secondary mt-2">
                    {parentTask.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-red-500 flex-shrink-0"
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
              <p className="text-body-m">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          {/* Title Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-heading-s font-medium text-text-primary">
                Título de la tarea
              </label>
              <span
                className={`text-body-m ${
                  titleValue.length > 80
                    ? "text-red-500"
                    : "text-text-secondary"
                }`}
              >
                {titleValue.length}/100
              </span>
            </div>
            <Input
              placeholder="¿Qué necesitas hacer?"
              error={errors.title?.message}
              disabled={isLoading}
              {...register("title", {
                required: "El título es requerido",
                minLength: {
                  value: 1,
                  message: "El título no puede estar vacío",
                },
                maxLength: {
                  value: 100,
                  message: "El título no puede exceder 100 caracteres",
                },
              })}
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-heading-s font-medium text-text-primary">
                Descripción
                <span className="text-body-m font-normal text-text-secondary ml-1">
                  (opcional)
                </span>
              </label>
              <span
                className={`text-body-m ${
                  descriptionValue.length > 400
                    ? "text-red-500"
                    : "text-text-secondary"
                }`}
              >
                {descriptionValue.length}/500
              </span>
            </div>
            <div className="relative">
              <textarea
                placeholder="Agrega más detalles sobre esta tarea..."
                rows={4}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-surface border border-lines-light rounded-lg text-body-l text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-main-purple focus:border-transparent resize-vertical min-h-[100px] max-h-[200px] disabled:opacity-50 transition-all duration-200"
                {...register("description", {
                  maxLength: {
                    value: 500,
                    message: "La descripción no puede exceder 500 caracteres",
                  },
                })}
              />
              {/* Icon */}
              <div className="absolute top-3 right-3">
                <svg
                  className="w-5 h-5 text-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </div>
            </div>
            {errors.description && (
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-red-500"
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
                <p className="text-body-m text-red-600">
                  {errors.description.message}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-lines-light">
            {/* Helper text */}
            <div className="hidden sm:block">
              <p className="text-body-m text-text-secondary">
                {parentTask ? (
                  <>🔗 Dividir una tarea grande en pasos pequeños</>
                ) : (
                  <>💡 Podrás agregar subtareas después</>
                )}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 sm:flex-none"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="primary-large"
                disabled={!isValid || isLoading}
                className="flex-1 sm:flex-none"
              >
                <div className="flex items-center justify-center space-x-2">
                  {isLoading && <LoadingSpinner size="sm" color="white" />}
                  <span>
                    {isLoading
                      ? mode === "edit"
                        ? "Guardando..."
                        : "Creando..."
                      : mode === "edit"
                      ? "Guardar cambios"
                      : "Crear tarea"}
                  </span>
                </div>
              </Button>
            </div>
          </div>
        </form>

        {/* Helper text mobile */}
        <div className="block sm:hidden">
          <p className="text-body-m text-text-secondary text-center">
            {parentTask ? (
              <>🔗 Dividir una tarea grande en pasos pequeños</>
            ) : (
              <>💡 Podrás agregar subtareas después</>
            )}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default TaskForm;
