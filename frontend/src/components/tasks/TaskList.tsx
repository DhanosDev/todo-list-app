"use client";

import React from "react";
import { Task } from "@/types";
import { TaskCard } from "./TaskCard";
import { LoadingSpinner } from "@/components/ui";

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  error?: string | null;
  onStatusToggle?: (taskId: string, status: "pending" | "completed") => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onAddSubtask?: (parentTaskId: string) => void;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function TaskList({
  tasks,
  isLoading = false,
  error = null,
  onStatusToggle,
  onEdit,
  onDelete,
  onAddSubtask,
  emptyMessage = "No hay tareas aún",
  emptyDescription = "Crea tu primera tarea para empezar a organizarte",
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-preset-5 text-text-secondary mt-4">
            Cargando tareas...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
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
          <h3 className="text-preset-3 text-text-primary mb-2">
            Error al cargar tareas
          </h3>
          <p className="text-preset-5 text-text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h3 className="text-preset-3 text-text-primary mb-2">
            {emptyMessage}
          </h3>
          <p className="text-preset-5 text-text-secondary">
            {emptyDescription}
          </p>
        </div>
      </div>
    );
  }

  const parentTasks = tasks.filter((task) => !task.parentTask);
  const subtasks = tasks.filter((task) => task.parentTask);

  const subtasksByParent = subtasks.reduce((acc, subtask) => {
    const parentId = subtask.parentTask!;
    if (!acc[parentId]) {
      acc[parentId] = [];
    }
    acc[parentId].push(subtask);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="space-y-4">
      {/* Parent Tasks */}
      {parentTasks.map((task) => (
        <div key={task._id} className="space-y-3">
          {/* Parent Task Card */}
          <TaskCard
            task={task}
            onStatusToggle={onStatusToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddSubtask={onAddSubtask}
            isLoading={isLoading}
            showSubtasks={true}
          />

          {/* Subtasks for this parent */}
          {subtasksByParent[task._id] && (
            <div className="ml-8 space-y-2">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-4 h-0.5 bg-gray-300"></div>
                <span className="text-preset-6 text-text-secondary font-medium">
                  Subtareas ({subtasksByParent[task._id].length})
                </span>
              </div>

              {subtasksByParent[task._id].map((subtask) => (
                <TaskCard
                  key={subtask._id}
                  task={subtask}
                  onStatusToggle={onStatusToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isLoading={isLoading}
                  showSubtasks={false}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Orphaned subtasks (shouldn't happen but just in case) */}
      {subtasks.filter(
        (subtask) =>
          !parentTasks.find((parent) => parent._id === subtask.parentTask)
      ).length > 0 && (
        <div className="border-t border-lines-light pt-4">
          <h4 className="text-preset-4 text-text-secondary mb-3">
            Subtareas sin padre
          </h4>
          <div className="space-y-2">
            {subtasks
              .filter(
                (subtask) =>
                  !parentTasks.find(
                    (parent) => parent._id === subtask.parentTask
                  )
              )
              .map((orphanedSubtask) => (
                <TaskCard
                  key={orphanedSubtask._id}
                  task={orphanedSubtask}
                  onStatusToggle={onStatusToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isLoading={isLoading}
                  showSubtasks={false}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;
