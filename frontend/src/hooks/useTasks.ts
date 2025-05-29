import { useState, useEffect, useCallback } from "react";
import {
  taskService,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
} from "@/services/taskService";
import { Task } from "@/types";

interface UseTasksState {
  tasks: Task[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
}

interface UseTasksActions {
  fetchTasks: (filters?: TaskFilters) => Promise<void>;
  refreshTasks: () => Promise<void>;

  createTask: (taskData: CreateTaskData) => Promise<Task | null>;
  updateTask: (
    taskId: string,
    taskData: UpdateTaskData
  ) => Promise<Task | null>;
  deleteTask: (taskId: string) => Promise<boolean>;
  toggleTaskStatus: (
    taskId: string,
    status: "pending" | "completed"
  ) => Promise<boolean>;

  createSubtask: (
    parentTaskId: string,
    taskData: Omit<CreateTaskData, "parentTask">
  ) => Promise<Task | null>;

  clearError: () => void;
  getTaskById: (taskId: string) => Task | undefined;
}

export type UseTasksReturn = UseTasksState & UseTasksActions;

export function useTasks(initialFilters?: TaskFilters): UseTasksReturn {
  const [state, setState] = useState<UseTasksState>({
    tasks: [],
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
  });

  const [currentFilters, setCurrentFilters] = useState<TaskFilters | undefined>(
    initialFilters
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const fetchTasks = useCallback(async (filters?: TaskFilters) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      setCurrentFilters(filters);

      const tasks = await taskService.getTasks(filters);

      setState((prev) => ({
        ...prev,
        tasks,
        isLoading: false,
      }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch tasks";
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
    }
  }, []);

  const refreshTasks = useCallback(async () => {
    await fetchTasks(currentFilters);
  }, [fetchTasks, currentFilters]);

  const createTask = useCallback(
    async (taskData: CreateTaskData): Promise<Task | null> => {
      try {
        setState((prev) => ({ ...prev, isCreating: true, error: null }));

        const newTask = await taskService.createTask(taskData);

        setState((prev) => ({
          ...prev,
          tasks: [newTask, ...prev.tasks],
          isCreating: false,
        }));

        return newTask;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create task";
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isCreating: false,
        }));
        return null;
      }
    },
    []
  );

  const updateTask = useCallback(
    async (taskId: string, taskData: UpdateTaskData): Promise<Task | null> => {
      try {
        setState((prev) => ({ ...prev, isUpdating: true, error: null }));

        const updatedTask = await taskService.updateTask(taskId, taskData);

        setState((prev) => ({
          ...prev,
          tasks: prev.tasks.map((task) =>
            task._id === taskId ? updatedTask : task
          ),
          isUpdating: false,
        }));

        return updatedTask;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update task";
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isUpdating: false,
        }));
        return null;
      }
    },
    []
  );

  const deleteTask = useCallback(async (taskId: string): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isDeleting: true, error: null }));

      await taskService.deleteTask(taskId);

      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((task) => task._id !== taskId),
        isDeleting: false,
      }));

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete task";
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isDeleting: false,
      }));
      return false;
    }
  }, []);

  const toggleTaskStatus = useCallback(
    async (
      taskId: string,
      status: "pending" | "completed"
    ): Promise<boolean> => {
      const task = state.tasks.find((t) => t._id === taskId);
      const isSubtask = !!task?.parentTask;

      try {
        setState((prev) => ({ ...prev, isUpdating: true, error: null }));

        const updatedTask = await taskService.toggleTaskStatus(taskId, status);

        setState((prev) => ({
          ...prev,
          tasks: prev.tasks.map((task) =>
            task._id === taskId ? updatedTask : task
          ),
          isUpdating: false,
        }));

        if (isSubtask) {
          setTimeout(() => {
            refreshTasks();
          }, 100);
        }

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update task status";
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isUpdating: false,
        }));
        return false;
      }
    },
    [state.tasks, refreshTasks]
  );

  const createSubtask = useCallback(
    async (
      parentTaskId: string,
      taskData: Omit<CreateTaskData, "parentTask">
    ): Promise<Task | null> => {
      try {
        setState((prev) => ({ ...prev, isCreating: true, error: null }));

        const newSubtask = await taskService.createSubtask(
          parentTaskId,
          taskData
        );

        setState((prev) => ({
          ...prev,
          tasks: [newSubtask, ...prev.tasks],
          isCreating: false,
        }));

        setTimeout(() => {
          refreshTasks();
        }, 100);

        return newSubtask;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create subtask";
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isCreating: false,
        }));
        return null;
      }
    },
    [refreshTasks]
  );

  const getTaskById = useCallback(
    (taskId: string): Task | undefined => {
      return state.tasks.find((task) => task._id === taskId);
    },
    [state.tasks]
  );

  useEffect(() => {
    fetchTasks(initialFilters);
  }, []);

  return {
    ...state,

    fetchTasks,
    refreshTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    createSubtask,
    clearError,
    getTaskById,
  };
}

export function useTaskFilters() {
  const [filters, setFilters] = useState<TaskFilters>({});

  const updateFilter = useCallback(
    (key: keyof TaskFilters, value: TaskFilters[keyof TaskFilters]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    filters,
    updateFilter,
    clearFilters,
    setFilters,
  };
}

export default useTasks;
