import React, { useEffect } from "react";
import { CommentList } from "./CommentList";
import { QuickCommentForm } from "./CommentForm";
import { useComments } from "@/hooks/useComments";
import { LoadingSpinner } from "@/components/ui";

interface CommentSectionProps {
  taskId: string;
  taskTitle?: string;
  onCommentCountChange?: (count: number) => void;
}

export function CommentSection({
  taskId,
  taskTitle,
  onCommentCountChange,
}: CommentSectionProps) {
  const {
    comments,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
    clearError,
  } = useComments();

  useEffect(() => {
    if (taskId) {
      fetchComments(taskId);
    }
  }, [taskId, fetchComments]);

  useEffect(() => {
    onCommentCountChange?.(comments.length);
  }, [comments.length, onCommentCountChange]);

  const handleCreateComment = async (content: string) => {
    await createComment(taskId, content);
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    await updateComment(commentId, content);
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);
  };

  if (!taskId) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-preset-5 text-red-600 font-medium">
          Error: TaskId is required
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header - Simple and Clean */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-main-purple"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12a8 8 0 018-8c4.418 0 8 3.582 8 8z"
              />
            </svg>
            <h3 className="text-preset-2 text-text-primary">
              Comentarios
              {comments.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-preset-6 bg-main-purple/10 text-main-purple font-medium">
                  {comments.length}
                </span>
              )}
            </h3>
          </div>

          {taskTitle && (
            <p className="text-preset-5 text-text-secondary mt-1">
              en{" "}
              <span className="font-medium text-text-primary">
                &quot;{taskTitle}&quot;
              </span>
            </p>
          )}
        </div>

        {/* Subtle loading indicator */}
        {(isCreating || isUpdating || isDeleting) && (
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="sm" color="primary" />
            <span className="text-preset-6 text-text-secondary">
              {isCreating && "Enviando..."}
              {isUpdating && "Actualizando..."}
              {isDeleting && "Eliminando..."}
            </span>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-red-400 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h4 className="text-preset-5 font-medium text-red-800">
                  Error al cargar comentarios
                </h4>
                <p className="text-preset-6 text-red-700 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600 transition-colors p-1 hover:bg-red-100 rounded-md"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Create Comment Form */}
      <div className="bg-light-grey border border-lines-light rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <svg
            className="w-4 h-4 text-text-secondary"
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
          <span className="text-preset-5 text-text-secondary font-medium">
            Nuevo comentario
          </span>
        </div>

        <QuickCommentForm
          onSubmit={handleCreateComment}
          isLoading={isCreating}
          placeholder="Comparte tu opinión sobre esta tarea..."
        />
      </div>

      {/* Comments List */}
      <div className="bg-white border border-lines-light rounded-lg">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <LoadingSpinner size="md" color="primary" />
              <p className="text-preset-5 text-text-secondary mt-3">
                Cargando comentarios...
              </p>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 px-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12a8 8 0 018-8c4.418 0 8 3.582 8 8z"
                />
              </svg>
            </div>
            <h4 className="text-preset-4 text-text-primary mb-1">
              Sin comentarios aún
            </h4>
            <p className="text-preset-5 text-text-secondary">
              Sé el primero en comentar esta tarea
            </p>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-lines-light">
              <svg
                className="w-4 h-4 text-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z"
                />
              </svg>
              <span className="text-preset-5 text-text-secondary font-medium">
                {comments.length} comentario{comments.length !== 1 ? "s" : ""}
              </span>
            </div>

            <CommentList
              comments={comments}
              isLoading={isLoading}
              onUpdateComment={handleUpdateComment}
              onDeleteComment={handleDeleteComment}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          </div>
        )}
      </div>
    </div>
  );
}
