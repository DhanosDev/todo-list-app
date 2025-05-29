import React, { useEffect } from "react";
import { CommentList } from "./CommentList";
import { QuickCommentForm } from "./CommentForm";
import { useComments } from "@/hooks/useComments";

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
      <div className="text-center py-8 text-red-500">
        <p>Error: TaskId is required</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Comentarios
            {comments.length > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                ({comments.length})
              </span>
            )}
          </h3>
          {taskTitle && (
            <p className="text-sm text-gray-600 mt-1">
              en &quot;{taskTitle}&quot;
            </p>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600"
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
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <QuickCommentForm
          onSubmit={handleCreateComment}
          isLoading={isCreating}
          placeholder="Escribe un comentario sobre esta tarea..."
        />
      </div>

      {/* Comments List */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <CommentList
          comments={comments}
          isLoading={isLoading}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}
