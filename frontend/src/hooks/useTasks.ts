import { useState, useEffect, useCallback, useMemo } from "react";
import {
  taskService,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
} from "@/services/taskService";
import { Task } from "@/types";

interface UseTasksState {
  tasks: Task[];
  allTasks: Task[];
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
    allTasks: [],
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

      const allTasksFromAPI = await taskService.getTasks();

      let filteredTasks = allTasksFromAPI;

      if (filters?.status) {
        filteredTasks = filteredTasks.filter(
          (task) => task.status === filters.status
        );
      }

      if (filters?.includeSubtasks === false) {
        filteredTasks = filteredTasks.filter((task) => !task.parentTask);
      }

      setState((prev) => ({
        ...prev,
        allTasks: allTasksFromAPI,
        tasks: filteredTasks,
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
          allTasks: [newTask, ...prev.allTasks],
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

          allTasks: prev.allTasks.map((task) =>
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
        tasks: prev.tasks.filter(
          (task) => task._id !== taskId && task.parentTask !== taskId
        ),
        allTasks: prev.allTasks.filter(
          (task) => task._id !== taskId && task.parentTask !== taskId
        ),
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

  const updateParentTaskCounter = useCallback(
    (parentTaskId: string, statusChange: "completed" | "pending") => {
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) => {
          if (task._id === parentTaskId) {
            const currentPending = task.pendingSubtasks || 0;
            const newPending =
              statusChange === "completed"
                ? Math.max(0, currentPending - 1)
                : currentPending + 1;

            return {
              ...task,
              pendingSubtasks: newPending,
            };
          }
          return task;
        }),

        allTasks: prev.allTasks.map((task) => {
          if (task._id === parentTaskId) {
            const currentPending = task.pendingSubtasks || 0;
            const newPending =
              statusChange === "completed"
                ? Math.max(0, currentPending - 1)
                : currentPending + 1;

            return {
              ...task,
              pendingSubtasks: newPending,
            };
          }
          return task;
        }),
      }));
    },
    []
  );

  const toggleTaskStatus = useCallback(
    async (
      taskId: string,
      status: "pending" | "completed"
    ): Promise<boolean> => {
      const task = state.tasks.find((t) => t._id === taskId);
      const isSubtask = !!task?.parentTask;
      const parentTaskId = task?.parentTask;
      const originalStatus = task?.status;

      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) =>
          task._id === taskId ? { ...task, status } : task
        ),
        allTasks: prev.allTasks.map((task) =>
          task._id === taskId ? { ...task, status } : task
        ),
      }));

      if (isSubtask && parentTaskId && originalStatus) {
        updateParentTaskCounter(parentTaskId, status);
      }

      try {
        const updatedTask = await taskService.toggleTaskStatus(taskId, status);

        setState((prev) => ({
          ...prev,
          tasks: prev.tasks.map((task) =>
            task._id === taskId ? updatedTask : task
          ),
          allTasks: prev.allTasks.map((task) =>
            task._id === taskId ? updatedTask : task
          ),
        }));

        return true;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          tasks: prev.tasks.map((task) =>
            task._id === taskId && originalStatus
              ? { ...task, status: originalStatus }
              : task
          ),
          allTasks: prev.allTasks.map((task) =>
            task._id === taskId && originalStatus
              ? { ...task, status: originalStatus }
              : task
          ),
          error:
            err instanceof Error ? err.message : "Failed to update task status",
        }));

        if (isSubtask && parentTaskId && originalStatus) {
          updateParentTaskCounter(parentTaskId, originalStatus);
        }

        return false;
      }
    },
    [state.tasks, updateParentTaskCounter]
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
          tasks: [
            newSubtask,
            ...prev.tasks.map((task) => {
              if (task._id === parentTaskId) {
                return {
                  ...task,
                  subtaskCount: (task.subtaskCount || 0) + 1,
                  pendingSubtasks: (task.pendingSubtasks || 0) + 1,
                };
              }
              return task;
            }),
          ],

          allTasks: [
            newSubtask,
            ...prev.allTasks.map((task) => {
              if (task._id === parentTaskId) {
                return {
                  ...task,
                  subtaskCount: (task.subtaskCount || 0) + 1,
                  pendingSubtasks: (task.pendingSubtasks || 0) + 1,
                };
              }
              return task;
            }),
          ],
          isCreating: false,
        }));

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
    []
  );

  const getTaskById = useCallback(
    (taskId: string): Task | undefined => {
      return state.tasks.find((task) => task._id === taskId);
    },
    [state.tasks]
  );

  const returnValue = useMemo(
    () => ({
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
    }),
    [
      state,
      fetchTasks,
      refreshTasks,
      createTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      createSubtask,
      clearError,
      getTaskById,
    ]
  );

  useEffect(() => {
    if (initialFilters) {
      fetchTasks(initialFilters);
    } else {
      fetchTasks();
    }
  }, []);

  return returnValue;
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

  const returnValue = useMemo(
    () => ({
      filters,
      updateFilter,
      clearFilters,
      setFilters,
    }),
    [filters, updateFilter, clearFilters, setFilters]
  );

  return returnValue;
}

export default useTasks;
