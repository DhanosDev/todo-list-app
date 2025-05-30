import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { EditCommentForm } from "./CommentForm";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Comment } from "@/hooks/useComments";
import { useAuth } from "@/hooks/useAuth";

interface CommentListProps {
  comments: Comment[];
  isLoading?: boolean;
  onUpdateComment: (commentId: string, content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

interface CommentItemProps {
  comment: Comment;
  onUpdate: (commentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  isUpdating: boolean;
  isDeleting: boolean;
  currentUserId: string;
}

function CommentItem({
  comment,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
  currentUserId,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const canModify = comment.user._id === currentUserId;

  const getRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: es,
      });
    } catch {
      return "Fecha inválida";
    }
  };

  const getUserInitial = (name: string) => {
    return name?.charAt(0)?.toUpperCase() || "U";
  };

  const getAvatarColor = (userId: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];

    const index = userId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const handleEditSubmit = async (content: string) => {
    await onUpdate(comment._id, content);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    await onDelete(comment._id);
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
      {/* User Avatar */}
      <div
        className={`
        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium
        ${getAvatarColor(comment.user._id)}
      `}
      >
        {getUserInitial(comment.user.name)}
      </div>

      {/* Comment Content */}
      <div className="flex-1 min-w-0">
        {/* Comment Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2 text-sm">
            <span className="font-medium text-gray-900">
              {comment.user.name}
            </span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">
              {getRelativeTime(comment.createdAt)}
            </span>
            {comment.createdAt !== comment.updatedAt && (
              <>
                <span className="text-gray-400">·</span>
                <span className="text-gray-400 text-xs">editado</span>
              </>
            )}
          </div>

          {/* Action Buttons */}
          {canModify && !isEditing && (
            <div className="flex items-center space-x-1">
              <Button
                variant="secondary"
                onClick={() => setIsEditing(true)}
                disabled={isUpdating || isDeleting}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Editar
              </Button>
              <Button
                variant="secondary"
                onClick={handleDeleteClick}
                disabled={isUpdating || isDeleting}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Eliminar
              </Button>
            </div>
          )}
        </div>

        {/* Comment Body */}
        {isEditing ? (
          <EditCommentForm
            initialContent={comment.content}
            onSubmit={handleEditSubmit}
            onCancel={handleEditCancel}
            isLoading={isUpdating}
          />
        ) : (
          <p className="text-gray-700 break-words overflow-wrap-anywhere">
            {comment.content}
          </p>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-700 mb-2">
              ¿Estás seguro de que quieres eliminar este comentario?
            </p>
            <div className="flex space-x-2">
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="text-xs"
              >
                {isDeleting ? (
                  <div className="flex items-center space-x-1">
                    <LoadingSpinner size="sm" color="white" />
                    <span>Eliminando...</span>
                  </div>
                ) : (
                  "Eliminar"
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={handleDeleteCancel}
                disabled={isDeleting}
                className="text-xs"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CommentList({
  comments,
  isLoading,
  onUpdateComment,
  onDeleteComment,
  isUpdating = false,
  isDeleting = false,
}: CommentListProps) {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="md" color="primary" />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg
          className="w-12 h-12 mx-auto mb-3 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p className="text-sm">No hay comentarios aún</p>
        <p className="text-xs text-gray-400 mt-1">Sé el primero en comentar</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          onUpdate={onUpdateComment}
          onDelete={onDeleteComment}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          currentUserId={user?.id || ""}
        />
      ))}
    </div>
  );
}
