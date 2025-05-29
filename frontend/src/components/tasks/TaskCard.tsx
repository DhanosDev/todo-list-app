"use client";

import React, { useState } from "react";
import { Task } from "@/types";
import { Card, Button, Modal } from "@/components/ui";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface TaskCardProps {
  readonly task: Task;
  readonly onStatusToggle?: (
    taskId: string,
    status: "pending" | "completed"
  ) => void;
  readonly onEdit?: (task: Task) => void;
  readonly onDelete?: (taskId: string) => void;
  readonly onAddSubtask?: (parentTaskId: string) => void;
  readonly isLoading?: boolean;
  readonly showSubtasks?: boolean;
}

export function TaskCard({
  task,
  onStatusToggle,
  onEdit,
  onDelete,
  onAddSubtask,
  isLoading = false,
  showSubtasks = true,
}: TaskCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleStatusToggle = () => {
    if (onStatusToggle && !isLoading) {
      const newStatus = task.status === "pending" ? "completed" : "pending";
      onStatusToggle(task.id, newStatus);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(task.id);
      setShowDeleteModal(false);
    }
  };

  const getRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: es,
      });
    } catch {
      return "Fecha inválida";
    }
  };

  const statusStyles = {
    pending: {
      badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
      checkbox: "border-gray-300",
      card: "border-l-yellow-400",
    },
    completed: {
      badge: "bg-green-100 text-green-800 border-green-200",
      checkbox: "border-green-500 bg-green-500",
      card: "border-l-green-400",
    },
  };

  const currentStyles = statusStyles[task.status];
  const isParentTask = !task.parentTask;

  const hasSubtasks = task.subtaskCount !== undefined && task.subtaskCount > 0;

  return (
    <>
      <Card
        className={`border-l-4 ${currentStyles.card} ${
          task.status === "completed" ? "opacity-75" : ""
        }`}
        hover={true}
        padding="md"
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              {/* Status Checkbox */}
              <button
                onClick={handleStatusToggle}
                disabled={isLoading}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  currentStyles.checkbox
                } ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-80"
                }`}
              >
                {task.status === "completed" && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              {/* Task Content */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-preset-3 font-medium ${
                    task.status === "completed"
                      ? "line-through text-text-secondary"
                      : "text-text-primary"
                  }`}
                >
                  {task.title}
                </h3>

                {task.description && (
                  <p className="text-preset-5 mt-1 text-text-secondary">
                    {task.description}
                  </p>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <span
              className={`px-2 py-1 text-preset-6 font-medium rounded-full border ${currentStyles.badge}`}
            >
              {task.status === "pending" ? "Pendiente" : "Completada"}
            </span>
          </div>

          {/* Subtask Info */}
          {isParentTask && hasSubtasks && showSubtasks && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span className="text-preset-6 text-gray-600">
                    {task.subtaskCount} subtarea
                    {task.subtaskCount !== 1 ? "s" : ""}
                  </span>
                </div>

                {task.pendingSubtasks !== undefined &&
                  task.pendingSubtasks > 0 && (
                    <span className="text-preset-6 text-yellow-600">
                      {task.pendingSubtasks} pendiente
                      {task.pendingSubtasks !== 1 ? "s" : ""}
                    </span>
                  )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center justify-between text-preset-6 text-text-secondary">
            <span>{isParentTask ? "📋 Tarea principal" : "📝 Subtarea"}</span>
            <span>{getRelativeTime(task.createdAt)}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-lines-light">
            <div className="flex items-center space-x-2">
              {/* Edit Button */}
              <Button
                variant="secondary"
                onClick={() => onEdit?.(task)}
                disabled={isLoading}
              >
                Editar
              </Button>

              {/* Add Subtask Button (only for parent tasks) */}
              {isParentTask && onAddSubtask && (
                <Button
                  variant="secondary"
                  onClick={() => onAddSubtask(task.id)}
                  disabled={isLoading}
                >
                  + Subtarea
                </Button>
              )}
            </div>

            {/* Delete Button */}
            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
              disabled={isLoading}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar tarea"
        actions={{
          primary: {
            label: "Eliminar",
            onClick: handleDelete,
            variant: "destructive",
          },
          secondary: {
            label: "Cancelar",
            onClick: () => setShowDeleteModal(false),
          },
        }}
      >
        <p className="text-preset-5 text-text-secondary">
          ¿Estás seguro de que quieres eliminar esta tarea?
          {hasSubtasks && (
            <span className="text-red-600 font-medium">
              {" "}
              Esto también eliminará todas sus subtareas.
            </span>
          )}
        </p>
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-preset-6 font-medium text-text-primary">
            {task.title}
          </p>
          {task.description && (
            <p className="text-preset-6 text-text-secondary mt-1">
              {task.description}
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}

export default TaskCard;
