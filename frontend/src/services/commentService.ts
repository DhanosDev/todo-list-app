// src/services/commentService.ts
import api from "./api";
import { Comment } from "@/hooks/useComments";

export interface CreateCommentData {
  content: string;
}

export interface UpdateCommentData {
  content: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  count?: number;
}

class CommentService {
  // Get all comments for a specific task
  async getTaskComments(taskId: string): Promise<Comment[]> {
    const response = await api.get<ApiResponse<Comment[]>>(
      `/tasks/${taskId}/comments`
    );
    return response.data.data;
  }

  // Create a new comment for a task
  async createComment(taskId: string, content: string): Promise<Comment> {
    if (!taskId || taskId === "undefined") {
      throw new Error("TaskId is required and cannot be undefined");
    }

    const data: CreateCommentData = { content };
    const response = await api.post<ApiResponse<Comment>>(
      `/tasks/${taskId}/comments`,
      data
    );
    return response.data.data;
  }

  // Get a specific comment by ID
  async getComment(commentId: string): Promise<Comment> {
    const response = await api.get<ApiResponse<Comment>>(
      `/comments/${commentId}`
    );
    return response.data.data;
  }

  // Update an existing comment
  async updateComment(commentId: string, content: string): Promise<Comment> {
    const data: UpdateCommentData = { content };
    const response = await api.put<ApiResponse<Comment>>(
      `/comments/${commentId}`,
      data
    );
    return response.data.data;
  }

  // Delete a comment
  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/comments/${commentId}`);
  }

  // Get comment count for a task
  async getCommentCount(taskId: string): Promise<number> {
    const response = await api.get<ApiResponse<{ count: number }>>(
      `/tasks/${taskId}/comments/count`
    );
    return response.data.data.count;
  }
}

// Export singleton instance
export const commentService = new CommentService();
