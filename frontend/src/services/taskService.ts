import { AxiosError } from "axios";
import api from "./api";
import { Task } from "@/types";

export interface CreateTaskData {
  title: string;
  description: string;
  parentTask?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: "pending" | "completed";
}

export interface TaskFilters {
  status?: "pending" | "completed";
  includeSubtasks?: boolean;
}

export interface TaskResponse {
  success: boolean;
  message: string;
  data: Task;
}

export interface TaskListResponse {
  success: boolean;
  count: number;
  data: Task[];
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}

class TaskService {
  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    try {
      const params = new URLSearchParams();

      if (filters?.status) {
        params.append("status", filters.status);
      }
      if (filters?.includeSubtasks !== undefined) {
        params.append("includeSubtasks", filters.includeSubtasks.toString());
      }

      const queryString = params.toString();
      const url = `/tasks${queryString ? `?${queryString}` : ""}`;

      const response = await api.get<TaskListResponse>(url);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch tasks");
      }
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message ?? "Failed to fetch tasks";
      throw new Error(message);
    }
  }

  async getTask(taskId: string): Promise<Task> {
    try {
      const response = await api.get<TaskResponse>(`/tasks/${taskId}`);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch task");
      }
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message ?? "Failed to fetch task";
      throw new Error(message);
    }
  }

  async createTask(taskData: CreateTaskData): Promise<Task> {
    try {
      const response = await api.post<TaskResponse>("/tasks", taskData);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message ?? "Failed to create task");
      }
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (
        error.response?.data?.errors &&
        error.response.data.errors.length > 0
      ) {
        throw new Error(error.response.data.errors[0]);
      }
      throw new Error(error.message ?? "Failed to create task");
    }
  }

  async updateTask(taskId: string, taskData: UpdateTaskData): Promise<Task> {
    try {
      const response = await api.put<TaskResponse>(
        `/tasks/${taskId}`,
        taskData
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message ?? "Failed to update task");
      }
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message ?? "Failed to update task");
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      const response = await api.delete<{ success: boolean; message: string }>(
        `/tasks/${taskId}`
      );

      if (!response.data.success) {
        throw new Error(response.data.message ?? "Failed to delete task");
      }
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message ?? "Failed to delete task";
      throw new Error(message);
    }
  }

  async toggleTaskStatus(
    taskId: string,
    status: "pending" | "completed"
  ): Promise<Task> {
    try {
      const response = await api.put<TaskResponse>(`/tasks/${taskId}/status`, {
        status,
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message ?? "Failed to update task status"
        );
      }
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message =
        error.response?.data?.message ?? "Failed to update task status";
      throw new Error(message);
    }
  }

  async getSubtasks(parentTaskId: string): Promise<Task[]> {
    try {
      const response = await api.get<TaskListResponse>(
        `/tasks/${parentTaskId}/subtasks`
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch subtasks");
      }
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message =
        error.response?.data?.message ?? "Failed to fetch subtasks";
      throw new Error(message);
    }
  }

  async createSubtask(
    parentTaskId: string,
    taskData: Omit<CreateTaskData, "parentTask">
  ): Promise<Task> {
    try {
      const response = await api.post<TaskResponse>(
        `/tasks/${parentTaskId}/subtasks`,
        taskData
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message ?? "Failed to create subtask");
      }
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message ?? "Failed to create subtask");
    }
  }
}

export const taskService = new TaskService();
export default taskService;
