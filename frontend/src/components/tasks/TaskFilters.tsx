"use client";

import React from "react";
import { Button } from "@/components/ui";
import { TaskFilters as ITaskFilters } from "@/services/taskService";

interface TaskFiltersProps {
  currentFilters: ITaskFilters;
  onFiltersChange: (filters: ITaskFilters) => void;
  taskCounts?: {
    total: number;
    pending: number;
    completed: number;
  };
  isLoading?: boolean;
}

export function TaskFilters({
  currentFilters,
  onFiltersChange,
  taskCounts,
  isLoading = false,
}: TaskFiltersProps) {
  const handleStatusFilter = (status: "pending" | "completed" | undefined) => {
    onFiltersChange({
      ...currentFilters,
      status,
    });
  };

  const handleSubtasksToggle = () => {
    onFiltersChange({
      ...currentFilters,
      includeSubtasks: !currentFilters.includeSubtasks,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters =
    currentFilters.status || currentFilters.includeSubtasks === false;

  return (
    <div className="bg-surface border border-lines-light rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-preset-3 font-medium text-text-primary">Filtros</h3>
        {hasActiveFilters && (
          <Button
            variant="secondary"
            onClick={handleClearFilters}
            disabled={isLoading}
          >
            Limpiar
          </Button>
        )}
      </div>

      {/* Status Filters */}
      <div>
        <h4 className="text-preset-4 font-medium text-text-primary mb-3">
          Estado
        </h4>
        <div className="flex flex-wrap gap-2">
          {/* All Tasks */}
          <Button
            variant={!currentFilters.status ? "primary-small" : "secondary"}
            onClick={() => handleStatusFilter(undefined)}
            disabled={isLoading}
          >
            Todas
            {taskCounts && (
              <span className="ml-2 text-preset-6">({taskCounts.total})</span>
            )}
          </Button>

          {/* Pending Tasks */}
          <Button
            variant={
              currentFilters.status === "pending"
                ? "primary-small"
                : "secondary"
            }
            onClick={() => handleStatusFilter("pending")}
            disabled={isLoading}
          >
            Pendientes
            {taskCounts && (
              <span className="ml-2 text-preset-6">({taskCounts.pending})</span>
            )}
          </Button>

          {/* Completed Tasks */}
          <Button
            variant={
              currentFilters.status === "completed"
                ? "primary-small"
                : "secondary"
            }
            onClick={() => handleStatusFilter("completed")}
            disabled={isLoading}
          >
            Completadas
            {taskCounts && (
              <span className="ml-2 text-preset-6">
                ({taskCounts.completed})
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Display Options */}
      <div>
        <h4 className="text-preset-4 font-medium text-text-primary mb-3">
          Mostrar
        </h4>
        <div className="flex items-center space-x-4">
          {/* Include Subtasks Toggle */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={currentFilters.includeSubtasks !== false}
              onChange={handleSubtasksToggle}
              disabled={isLoading}
              className="w-4 h-4 text-main-purple bg-gray-100 border-gray-300 rounded focus:ring-main-purple focus:ring-2"
            />
            <span className="text-preset-5 text-text-primary">
              Incluir subtareas
            </span>
          </label>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="border-t border-lines-light pt-3">
          <p className="text-preset-6 text-text-secondary">
            Filtros activos:
            {currentFilters.status && (
              <span className="ml-1 px-2 py-1 bg-main-purple text-white rounded text-preset-6">
                {currentFilters.status === "pending"
                  ? "Pendientes"
                  : "Completadas"}
              </span>
            )}
            {currentFilters.includeSubtasks === false && (
              <span className="ml-1 px-2 py-1 bg-gray-200 text-gray-700 rounded text-preset-6">
                Solo tareas principales
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export default TaskFilters;
