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
  } = useForm<TaskFormData>({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
    },
  });

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
    <Card padding="lg" className="w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-preset-2 font-medium text-text-primary">
            {getFormTitle()}
          </h2>

          {/* Close button */}
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            ✕
          </Button>
        </div>

        {/* Parent task info */}
        {parentTask && (
          <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-main-purple">
            <p className="text-preset-6 text-text-secondary mb-1">
              Subtarea de:
            </p>
            <p className="text-preset-5 font-medium text-text-primary">
              {parentTask.title}
            </p>
            {parentTask.description && (
              <p className="text-preset-6 text-text-secondary mt-1">
                {parentTask.description}
              </p>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-preset-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Title Field */}
          <Input
            label="Título de la tarea"
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

          {/* Description Field */}
          <div>
            <label className="block text-preset-4 font-medium text-text-primary mb-2">
              Descripción (opcional)
            </label>
            <textarea
              placeholder="Agrega más detalles sobre esta tarea..."
              rows={4}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-surface border border-lines-light rounded-lg text-preset-5 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-main-purple focus:border-transparent resize-vertical min-h-[100px] max-h-[200px]"
              {...register("description", {
                maxLength: {
                  value: 500,
                  message: "La descripción no puede exceder 500 caracteres",
                },
              })}
            />
            {errors.description && (
              <p className="mt-1 text-preset-6 text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-lines-light">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="primary-large"
              disabled={!isValid || isLoading}
            >
              {isLoading && <LoadingSpinner size="sm" color="white" />}
              {isLoading
                ? mode === "edit"
                  ? "Guardando..."
                  : "Creando..."
                : mode === "edit"
                ? "Guardar cambios"
                : "Crear tarea"}
            </Button>
          </div>
        </form>

        {/* Helper text */}
        <div className="text-preset-6 text-text-secondary">
          <p>
            💡 <strong>Consejo:</strong>{" "}
            {parentTask
              ? "Las subtareas te ayudan a dividir tareas grandes en pasos más pequeños."
              : "Puedes agregar subtareas después de crear la tarea principal."}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default TaskForm;
