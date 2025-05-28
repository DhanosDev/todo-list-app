import { api } from "./api";
import { Task } from "@/types";

export interface CreateTaskData {
  title: string;
  description: string;
  parentTask?: string;
}

export const taskService = {
  getTasks: async (status?: "pending" | "completed") => {
    const params = status ? { status } : {};
    const response = await api.get("/tasks", { params });
    return response.data;
  },

  createTask: async (data: CreateTaskData) => {
    const response = await api.post("/tasks", data);
    return response.data;
  },

  updateTask: async (id: string, data: Partial<Task>) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  updateTaskStatus: async (id: string, status: "pending" | "completed") => {
    const response = await api.put(`/tasks/${id}/status`, { status });
    return response.data;
  },

  deleteTask: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};
