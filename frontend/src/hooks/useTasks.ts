import { useState, useEffect } from "react";
import { taskService, CreateTaskData } from "@/services/taskService";
import { Task } from "@/types";
import toast from "react-hot-toast";

export const useTasks = (statusFilter?: "pending" | "completed") => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks(statusFilter);
      setTasks(data);
    } catch (error) {
      toast.error("Error fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: CreateTaskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
      toast.success("Task created successfully");
    } catch (error) {
      toast.error("Error creating task");
    }
  };

  const updateTaskStatus = async (
    id: string,
    status: "pending" | "completed"
  ) => {
    try {
      await taskService.updateTaskStatus(id, status);
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? { ...task, status } : task))
      );
      toast.success("Task status updated");
    } catch (error) {
      toast.error("Error updating task");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Error deleting task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  return {
    tasks,
    loading,
    createTask,
    updateTaskStatus,
    deleteTask,
    refetchTasks: fetchTasks,
  };
};
