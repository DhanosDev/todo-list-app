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
    const newValue = !(currentFilters.includeSubtasks ?? true);
    onFiltersChange({
      ...currentFilters,
      includeSubtasks: newValue,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      includeSubtasks: true, // Valor por defecto explícito
    });
  };

  const hasActiveFilters =
    currentFilters.status || (currentFilters.includeSubtasks ?? true) === false;

  return (
    <div className="bg-surface border border-lines-light rounded-lg overflow-hidden">
      {/* Header - Fixed height to prevent jumping */}
      <div className="px-5 py-4 border-b border-lines-light">
        <div className="flex items-center justify-between min-h-[24px]">
          <h3 className="text-heading-m text-text-primary">Filtros</h3>
          <div className="flex items-center">
            <Button
              variant="secondary"
              onClick={handleClearFilters}
              disabled={isLoading || !hasActiveFilters}
              className={`transition-all duration-200 ${
                hasActiveFilters
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              Limpiar
            </Button>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Status Filters */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-2 h-2 bg-main-purple rounded-full mr-3"></div>
            <h4 className="text-heading-s text-text-secondary">Estado</h4>
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {/* All Tasks */}
            <button
              onClick={() => handleStatusFilter(undefined)}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-200 disabled:opacity-50 ${
                !currentFilters.status
                  ? "bg-main-purple text-white shadow-sm"
                  : "bg-gray-50 hover:bg-gray-100 text-text-primary"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-body-l font-medium">Todas</span>
                {taskCounts && (
                  <span
                    className={`text-body-m ${
                      !currentFilters.status
                        ? "text-white opacity-75"
                        : "text-text-secondary"
                    }`}
                  >
                    ({taskCounts.total})
                  </span>
                )}
              </div>
            </button>

            {/* Pending Tasks */}
            <button
              onClick={() => handleStatusFilter("pending")}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-200 disabled:opacity-50 ${
                currentFilters.status === "pending"
                  ? "bg-main-purple text-white shadow-sm"
                  : "bg-gray-50 hover:bg-gray-100 text-text-primary"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-body-l font-medium">Pendientes</span>
                {taskCounts && (
                  <span
                    className={`text-body-m ${
                      currentFilters.status === "pending"
                        ? "text-white opacity-75"
                        : "text-text-secondary"
                    }`}
                  >
                    ({taskCounts.pending})
                  </span>
                )}
              </div>
            </button>

            {/* Completed Tasks */}
            <button
              onClick={() => handleStatusFilter("completed")}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-200 disabled:opacity-50 ${
                currentFilters.status === "completed"
                  ? "bg-main-purple text-white shadow-sm"
                  : "bg-gray-50 hover:bg-gray-100 text-text-primary"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-body-l font-medium">Completadas</span>
                {taskCounts && (
                  <span
                    className={`text-body-m ${
                      currentFilters.status === "completed"
                        ? "text-white opacity-75"
                        : "text-text-secondary"
                    }`}
                  >
                    ({taskCounts.completed})
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Display Options */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-2 h-2 bg-main-purple rounded-full mr-3"></div>
            <h4 className="text-heading-s text-text-secondary">Mostrar</h4>
          </div>
          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={currentFilters.includeSubtasks ?? true}
                onChange={handleSubtasksToggle}
                disabled={isLoading}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                  currentFilters.includeSubtasks ?? true
                    ? "bg-main-purple border-main-purple"
                    : "border-gray-300 group-hover:border-main-purple"
                }`}
              >
                {(currentFilters.includeSubtasks ?? true) && (
                  <svg
                    className="w-3 h-3 text-white m-0.5"
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
              </div>
            </div>
            <span className="text-body-l text-text-primary group-hover:text-main-purple transition-colors">
              Incluir subtareas
            </span>
          </label>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-lines-light">
            <div className="flex items-center mb-3">
              <div className="w-2 h-2 bg-main-purple rounded-full mr-3"></div>
              <h4 className="text-heading-s text-text-secondary">
                Filtros activos
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentFilters.status && (
                <span className="inline-flex items-center px-3 py-1.5 bg-main-purple text-white rounded-md text-body-m font-medium">
                  {currentFilters.status === "pending"
                    ? "Pendientes"
                    : "Completadas"}
                </span>
              )}
              {(currentFilters.includeSubtasks ?? true) === false && (
                <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-body-m font-medium">
                  Solo tareas principales
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskFilters;
