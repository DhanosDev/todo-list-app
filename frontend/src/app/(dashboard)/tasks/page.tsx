"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useTasks, useTaskFilters } from "@/hooks/useTasks";
import { TaskList, TaskFilters, TaskForm } from "@/components/tasks";
import { Button, LoadingSpinner } from "@/components/ui";
import { Task } from "@/types";
import { CreateTaskData } from "@/services/taskService";

type ViewMode = "list" | "create" | "edit" | "create-subtask";

export default function TasksPage() {
  const { user } = useAuth();
  const { filters, setFilters } = useTaskFilters();
  const {
    tasks,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    createSubtask,
    clearError,
  } = useTasks();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [parentTaskForSubtask, setParentTaskForSubtask] = useState<Task | null>(
    null
  );
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks(filters);
  }, [filters, fetchTasks]);

  useEffect(() => {
    const fetchAllTasksForCounts = async () => {
      try {
        const taskService = await import("@/services/taskService");
        const allTasksData = await taskService.taskService.getTasks();
        setAllTasks(allTasksData);
      } catch (error) {
        console.error("Error fetching all tasks for counts:", error);

        setAllTasks(tasks);
      }
    };

    if (!isLoading) {
      fetchAllTasksForCounts();
    }
  }, [tasks, isLoading]);

  const taskCounts = {
    total: allTasks.length,
    pending: allTasks.filter((task) => task.status === "pending").length,
    completed: allTasks.filter((task) => task.status === "completed").length,
  };

  const handleCreateTask = async (data: CreateTaskData) => {
    try {
      clearError();
      const newTask = await createTask(data);

      if (newTask) {
        toast.success("Tarea creada exitosamente");
        setViewMode("list");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al crear tarea";
      toast.error(message);
    }
  };

  const handleEditTask = async (data: CreateTaskData) => {
    if (!selectedTask) return;

    try {
      clearError();
      const updatedTask = await updateTask(selectedTask.id, {
        title: data.title,
        description: data.description,
      });

      if (updatedTask) {
        toast.success("Tarea actualizada exitosamente");
        setViewMode("list");
        setSelectedTask(null);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al actualizar tarea";
      toast.error(message);
    }
  };

  const handleCreateSubtask = async (data: CreateTaskData) => {
    if (!parentTaskForSubtask) return;

    try {
      clearError();
      const newSubtask = await createSubtask(parentTaskForSubtask.id, {
        title: data.title,
        description: data.description,
      });

      if (newSubtask) {
        toast.success("Subtarea creada exitosamente");
        setViewMode("list");
        setParentTaskForSubtask(null);

        fetchTasks(filters);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al crear subtarea";
      toast.error(message);
    }
  };

  const handleStatusToggle = async (
    taskId: string,
    status: "pending" | "completed"
  ) => {
    try {
      clearError();
      const success = await toggleTaskStatus(taskId, status);

      if (success) {
        const statusText =
          status === "completed" ? "completada" : "marcada como pendiente";
        toast.success(`Tarea ${statusText}`);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al cambiar estado";
      toast.error(message);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      clearError();
      const success = await deleteTask(taskId);

      if (success) {
        toast.success("Tarea eliminada exitosamente");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al eliminar tarea";
      toast.error(message);
    }
  };

  const handleEditTaskClick = (task: Task) => {
    setSelectedTask(task);
    setViewMode("edit");
  };

  const handleAddSubtaskClick = (parentTaskId: string) => {
    const parentTask = tasks.find((task) => task.id === parentTaskId);
    if (parentTask) {
      setParentTaskForSubtask(parentTask);
      setViewMode("create-subtask");
    }
  };

  const handleCancelForm = () => {
    setViewMode("list");
    setSelectedTask(null);
    setParentTaskForSubtask(null);
    clearError();
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-lines-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-preset-1 font-bold text-text-primary">
                Mis Tareas
              </h1>
              <p className="text-preset-5 text-text-secondary mt-1">
                Hola {user?.name},{" "}
                {taskCounts.pending > 0
                  ? `tienes ${taskCounts.pending} tarea${
                      taskCounts.pending > 1 ? "s" : ""
                    } pendiente${taskCounts.pending > 1 ? "s" : ""}`
                  : "no tienes tareas pendientes"}
              </p>
            </div>

            {viewMode === "list" && (
              <Button
                variant="primary-large"
                onClick={() => setViewMode("create")}
                disabled={isLoading}
              >
                + Nueva Tarea
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          {viewMode === "list" && (
            <div className="lg:col-span-1">
              <TaskFilters
                currentFilters={filters}
                onFiltersChange={handleFiltersChange}
                taskCounts={taskCounts}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Main Content */}
          <div
            className={viewMode === "list" ? "lg:col-span-3" : "lg:col-span-4"}
          >
            {/* Create Task Form */}
            {viewMode === "create" && (
              <TaskForm
                mode="create"
                onSubmit={handleCreateTask}
                onCancel={handleCancelForm}
                isLoading={isCreating}
                error={error}
              />
            )}

            {/* Edit Task Form */}
            {viewMode === "edit" && selectedTask && (
              <TaskForm
                mode="edit"
                initialData={selectedTask}
                onSubmit={handleEditTask}
                onCancel={handleCancelForm}
                isLoading={isUpdating}
                error={error}
              />
            )}

            {/* Create Subtask Form */}
            {viewMode === "create-subtask" && parentTaskForSubtask && (
              <TaskForm
                mode="create"
                parentTask={parentTaskForSubtask}
                onSubmit={handleCreateSubtask}
                onCancel={handleCancelForm}
                isLoading={isCreating}
                error={error}
              />
            )}

            {/* Tasks List */}
            {viewMode === "list" && (
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-preset-4 text-text-secondary">
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <LoadingSpinner size="sm" />
                          <span>Cargando...</span>
                        </div>
                      ) : (
                        `${taskCounts.total} tarea${
                          taskCounts.total !== 1 ? "s" : ""
                        }`
                      )}
                    </span>

                    {taskCounts.total > 0 && !isLoading && (
                      <Button
                        variant="secondary"
                        onClick={() => fetchTasks(filters)}
                        disabled={isLoading}
                      >
                        🔄 Actualizar
                      </Button>
                    )}
                  </div>

                  {/* Mobile Create Button */}
                  <div className="lg:hidden">
                    <Button
                      variant="primary-small"
                      onClick={() => setViewMode("create")}
                      disabled={isLoading}
                    >
                      + Nueva
                    </Button>
                  </div>
                </div>

                {/* Tasks List */}
                <TaskList
                  tasks={tasks}
                  isLoading={isLoading || isUpdating || isDeleting}
                  error={error}
                  onStatusToggle={handleStatusToggle}
                  onEdit={handleEditTaskClick}
                  onDelete={handleDeleteTask}
                  onAddSubtask={handleAddSubtaskClick}
                  emptyMessage={
                    Object.keys(filters).length > 0
                      ? "No hay tareas que coincidan con los filtros"
                      : "No hay tareas aún"
                  }
                  emptyDescription={
                    Object.keys(filters).length > 0
                      ? "Intenta cambiar los filtros o crear una nueva tarea"
                      : "Crea tu primera tarea para empezar a organizarte"
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
