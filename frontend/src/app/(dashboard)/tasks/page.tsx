"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
    allTasks,
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
  const taskCounts = useMemo(
    () => ({
      total: allTasks.length,
      pending: allTasks.filter((task) => task.status === "pending").length,
      completed: allTasks.filter((task) => task.status === "completed").length,
    }),
    [allTasks]
  );

  const handleStatusToggle = useCallback(
    async (taskId: string, status: "pending" | "completed") => {
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
    },
    [toggleTaskStatus, clearError]
  );

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
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
    },
    [deleteTask, clearError]
  );

  const handleEditTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setViewMode("edit");
  }, []);

  const handleAddSubtaskClick = useCallback(
    (parentTaskId: string) => {
      console.log("Adding subtask for parent task:", parentTaskId);
      const parentTask = tasks.find((task) => task._id === parentTaskId);
      if (parentTask) {
        setParentTaskForSubtask(parentTask);
        setViewMode("create-subtask");
      }
    },
    [tasks]
  );

  const handleFiltersChange = useCallback(
    (newFilters: typeof filters) => {
      setFilters(newFilters);
    },
    [setFilters]
  );

  const handleCreateTask = useCallback(
    async (data: CreateTaskData) => {
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
    },
    [createTask, clearError]
  );

  const handleEditTask = useCallback(
    async (data: CreateTaskData) => {
      if (!selectedTask) return;

      try {
        clearError();
        const updatedTask = await updateTask(selectedTask._id, {
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
    },
    [selectedTask, updateTask, clearError]
  );

  const handleCreateSubtask = useCallback(
    async (data: CreateTaskData) => {
      if (!parentTaskForSubtask) return;

      try {
        clearError();
        const newSubtask = await createSubtask(parentTaskForSubtask._id, {
          title: data.title,
          description: data.description,
        });

        if (newSubtask) {
          toast.success("Subtarea creada exitosamente");
          setViewMode("list");
          setParentTaskForSubtask(null);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al crear subtarea";
        toast.error(message);
      }
    },
    [parentTaskForSubtask, createSubtask, clearError]
  );

  const handleCancelForm = useCallback(() => {
    setViewMode("list");
    setSelectedTask(null);
    setParentTaskForSubtask(null);
    clearError();
  }, [clearError]);

  const handleNewTaskClick = useCallback(() => {
    setViewMode("create");
  }, []);

  const handleRefreshClick = useCallback(() => {
    fetchTasks(filters);
  }, [fetchTasks, filters]);

  useEffect(() => {
    fetchTasks(filters);
  }, [filters, fetchTasks]);

  const statusMessage = useMemo(() => {
    if (taskCounts.pending > 0) {
      return `tienes ${taskCounts.pending} tarea${
        taskCounts.pending > 1 ? "s" : ""
      } pendiente${taskCounts.pending > 1 ? "s" : ""}`;
    }
    return "no tienes tareas pendientes";
  }, [taskCounts.pending]);

  const isAnyLoading = useMemo(
    () => isLoading || isUpdating || isDeleting,
    [isLoading, isUpdating, isDeleting]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-lines-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section - Title + User Info */}
            <div className="flex items-center gap-4">
              {/* Icon + Title */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-main-purple to-main-purple-hover rounded-xl flex items-center justify-center shadow-sm">
                  <svg
                    className="w-5 h-5 text-white"
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
                <div>
                  <h1 className="text-heading-l font-bold text-text-primary">
                    Mis Tareas
                  </h1>
                  <p className="text-body-m text-text-secondary">
                    Hola{" "}
                    <span className="font-medium text-text-primary">
                      {user?.name}
                    </span>
                    , {statusMessage}
                  </p>
                </div>
              </div>

              {/* Stats Compactas */}
              <div className="hidden sm:flex items-center gap-4 pl-4 border-l border-lines-light">
                {/* Total */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-body-m text-text-secondary font-medium">
                    {taskCounts.total}
                  </span>
                </div>

                {/* Pendientes Badge */}
                {taskCounts.pending > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-full">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-body-m text-yellow-700 font-medium">
                      {taskCounts.pending} pend.
                    </span>
                  </div>
                )}

                {/* Completadas */}
                {taskCounts.completed > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-body-m text-green-700 font-medium">
                      {taskCounts.completed} comp.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-3">
              {/* Filtros Activos Indicator */}
              {(filters.status || filters.includeSubtasks === false) && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-main-purple-hover bg-opacity-10 border border-main-purple-hover border-opacity-20 rounded-lg">
                  <svg
                    className="w-4 h-4 text-main-purple"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  <span className="text-body-m text-main-purple font-medium">
                    Filtros
                  </span>
                </div>
              )}

              {/* Nueva Tarea Button */}
              {viewMode === "list" && (
                <Button
                  variant="primary-large"
                  onClick={handleNewTaskClick}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2.5"
                >
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span className="hidden sm:inline text-body-l">
                    Nueva tarea
                  </span>
                  <span className="sm:hidden text-body-l">Nueva</span>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Stats - Solo visible en móvil */}
          <div className="sm:hidden mt-4 pt-4 border-t border-lines-light">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-body-m text-text-secondary">
                    {taskCounts.total} total
                  </span>
                </div>

                {taskCounts.pending > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-body-m text-yellow-600">
                      {taskCounts.pending} pend.
                    </span>
                  </div>
                )}

                {taskCounts.completed > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-body-m text-green-600">
                      {taskCounts.completed} comp.
                    </span>
                  </div>
                )}
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center gap-2">
                {(filters.status || filters.includeSubtasks === false) && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-main-purple-hover bg-opacity-10 rounded">
                    <svg
                      className="w-3 h-3 text-main-purple"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                    <span className="text-body-m text-main-purple">
                      Filtros
                    </span>
                  </div>
                )}
              </div>
            </div>
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
                {/* Quick Actions Bar Mejorada */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Left Section - Info */}
                    <div className="flex items-center gap-4">
                      {isLoading ? (
                        <div className="flex items-center gap-3">
                          <LoadingSpinner size="sm" />
                          <span className="text-body-l text-text-secondary">
                            Cargando tareas...
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-gray-400"
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
                            <span className="text-heading-s text-text-primary">
                              {taskCounts.total} tarea
                              {taskCounts.total !== 1 ? "s" : ""}
                            </span>
                          </div>

                          {/* Filtros activos indicator */}
                          {(filters.status ||
                            filters.includeSubtasks === false) && (
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-4 bg-main-purple rounded-full"></div>
                              <span className="text-body-m text-main-purple font-medium">
                                Filtros aplicados
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center gap-3">
                      {/* Mobile Create Button */}
                      <div className="lg:hidden">
                        <Button
                          variant="primary-small"
                          onClick={handleNewTaskClick}
                          disabled={isLoading}
                          className="flex items-center gap-2"
                        >
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
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Nueva
                        </Button>
                      </div>

                      {/* Refresh Button */}
                      {taskCounts.total > 0 && !isLoading && (
                        <Button
                          variant="secondary"
                          onClick={handleRefreshClick}
                          disabled={isLoading}
                          className="flex items-center gap-2 text-body-l"
                        >
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
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Actualizar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tasks List */}
                <TaskList
                  tasks={tasks}
                  isLoading={isAnyLoading}
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
