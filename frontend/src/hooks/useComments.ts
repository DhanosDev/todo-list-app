import { useState, useCallback } from "react";
import { commentService } from "@/services/commentService";
import toast from "react-hot-toast";

export interface Comment {
  _id: string;
  content: string;
  task: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UseCommentsState {
  comments: Comment[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
}

interface UseCommentsReturn extends UseCommentsState {
  fetchComments: (taskId: string) => Promise<void>;
  createComment: (taskId: string, content: string) => Promise<void>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  getCommentById: (commentId: string) => Comment | undefined;
  clearError: () => void;
  refreshComments: (taskId: string) => Promise<void>;
}

export function useComments(): UseCommentsReturn {
  const [state, setState] = useState<UseCommentsState>({
    comments: [],
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
  });

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const fetchComments = useCallback(async (taskId: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const comments = await commentService.getTaskComments(taskId);
      setState((prev) => ({
        ...prev,
        comments,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error loading comments";
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
        comments: [],
      }));
      toast.error("Error cargando comentarios");
    }
  }, []);

  const createComment = useCallback(async (taskId: string, content: string) => {
    setState((prev) => ({ ...prev, isCreating: true, error: null }));

    try {
      const newComment = await commentService.createComment(taskId, content);

      setState((prev) => ({
        ...prev,
        comments: [newComment, ...prev.comments],
        isCreating: false,
      }));

      toast.success("Comentario agregado");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error creating comment";
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isCreating: false,
      }));
      toast.error("Error al agregar comentario");
    }
  }, []);

  const updateComment = useCallback(
    async (commentId: string, content: string) => {
      setState((prev) => ({ ...prev, isUpdating: true, error: null }));

      try {
        const updatedComment = await commentService.updateComment(
          commentId,
          content
        );

        setState((prev) => ({
          ...prev,
          comments: prev.comments.map((comment) =>
            comment._id === commentId ? updatedComment : comment
          ),
          isUpdating: false,
        }));

        toast.success("Comentario actualizado");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error updating comment";
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isUpdating: false,
        }));
        toast.error("Error al actualizar comentario");
      }
    },
    []
  );

  const deleteComment = useCallback(async (commentId: string) => {
    setState((prev) => ({ ...prev, isDeleting: true, error: null }));

    try {
      await commentService.deleteComment(commentId);

      setState((prev) => ({
        ...prev,
        comments: prev.comments.filter((comment) => comment._id !== commentId),
        isDeleting: false,
      }));

      toast.success("Comentario eliminado");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error deleting comment";
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isDeleting: false,
      }));
      toast.error("Error al eliminar comentario");
    }
  }, []);

  const getCommentById = useCallback(
    (commentId: string) => {
      return state.comments.find((comment) => comment._id === commentId);
    },
    [state.comments]
  );

  const refreshComments = useCallback(
    async (taskId: string) => {
      await fetchComments(taskId);
    },
    [fetchComments]
  );

  return {
    ...state,
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
    getCommentById,
    clearError,
    refreshComments,
  };
}
