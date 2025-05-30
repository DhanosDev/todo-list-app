import React, { useState, memo, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Task } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { CommentSection } from "./CommentSection";

interface TaskCardProps {
  task: Task;
  onStatusToggle?: (taskId: string, status: "pending" | "completed") => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onAddSubtask?: (parentTaskId: string) => void;
  isLoading?: boolean;
  showSubtasks?: boolean;
}

export const TaskCard = memo(
  function TaskCard({
    task,
    onStatusToggle,
    onEdit,
    onDelete,
    onAddSubtask,
    isLoading = false,
  }: TaskCardProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [_commentCount, setCommentCount] = useState(0);

    const getRelativeTime = useCallback((dateString: string) => {
      try {
        return formatDistanceToNow(new Date(dateString), {
          addSuffix: true,
          locale: es,
        });
      } catch {
        return "Fecha inválida";
      }
    }, []);

    const handleStatusToggle = useCallback(() => {
      if (isLoading) return;
      const newStatus = task.status === "pending" ? "completed" : "pending";
      onStatusToggle?.(task._id, newStatus);
    }, [isLoading, task.status, task._id, onStatusToggle]);

    const handleEdit = useCallback(() => {
      if (isLoading) return;
      onEdit?.(task);
    }, [isLoading, task, onEdit]);

    const handleDelete = useCallback(() => {
      if (isLoading) return;
      setShowDeleteModal(true);
    }, [isLoading]);

    const handleConfirmDelete = useCallback(() => {
      onDelete?.(task._id);
      setShowDeleteModal(false);
    }, [task._id, onDelete]);

    const handleAddSubtask = useCallback(() => {
      if (isLoading) return;
      onAddSubtask?.(task._id);
    }, [isLoading, task, onAddSubtask]);

    const handleCommentsClick = useCallback(() => {
      setShowCommentsModal(true);
    }, []);

    const handleCommentCountChange = useCallback((count: number) => {
      setCommentCount(count);
    }, []);

    const handleCloseDeleteModal = useCallback(() => {
      setShowDeleteModal(false);
    }, []);

    const handleCloseCommentsModal = useCallback(() => {
      setShowCommentsModal(false);
    }, []);

    const statusStyles = useCallback(
      () => ({
        pending: {
          badge: "bg-yellow-50 text-yellow-700 border border-yellow-200",
          checkbox:
            "border-lines-light hover:border-yellow-400 hover:bg-yellow-50",
          card: "border-lines-light hover:border-yellow-300 hover:shadow-md",
          accent: "border-l-4 border-l-yellow-400",
          icon: "text-yellow-500",
        },
        completed: {
          badge: "bg-green-50 text-green-700 border border-green-200",
          checkbox: "bg-green-500 border-green-500 shadow-sm",
          card: "border-lines-light hover:border-green-300 hover:shadow-md",
          accent: "border-l-4 border-l-green-400",
          icon: "text-green-500",
        },
      }),
      []
    );

    const currentStyles = statusStyles()[task.status];
    const hasSubtasks =
      task.subtaskCount !== undefined && task.subtaskCount > 0;
    const canComplete =
      task.status === "pending"
        ? task.pendingSubtasks === undefined || task.pendingSubtasks === 0
        : true;
    const isSubtask = !!task.parentTask;

    return (
      <>
        {/* Task Card */}
        <div
          className={`
            group relative bg-surface rounded-xl shadow-sm transition-all duration-300
            ${currentStyles.card} ${currentStyles.accent}
            ${isLoading ? "opacity-60 cursor-not-allowed" : "cursor-default"}
            ${isSubtask ? "ml-6 border-l-2 border-l-gray-300" : ""}
            hover:shadow-md hover:-translate-y-0.5
          `}
        >
          {/* Priority Indicator */}
          {!isSubtask && (
            <div
              className={`absolute top-0 right-0 w-2 h-2 rounded-bl rounded-tr-xl ${
                task.status === "pending" ? "bg-yellow-400" : "bg-green-400"
              }`}
            />
          )}

          <div className="p-4">
            {/* Task Header */}
            <div className="flex items-start gap-3 mb-2">
              {/* Enhanced Status Checkbox */}
              <button
                onClick={handleStatusToggle}
                disabled={
                  isLoading || (task.status === "pending" && !canComplete)
                }
                className={`
                  group/checkbox flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center 
                  transition-all duration-200 shadow-sm
                  ${
                    task.status === "completed"
                      ? "bg-green-500 border-green-500 hover:bg-green-600 hover:scale-105"
                      : canComplete
                      ? "border-lines-light hover:border-green-400 hover:bg-green-50 hover:scale-105"
                      : "border-red-300 bg-red-50 cursor-not-allowed"
                  }
                  ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}
                `}
                title={
                  !canComplete
                    ? "No se puede completar: hay subtareas pendientes"
                    : ""
                }
              >
                {task.status === "completed" && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {task.status === "pending" && canComplete && (
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300 group-hover/checkbox:bg-green-400 transition-colors" />
                )}
                {task.status === "pending" && !canComplete && (
                  <svg
                    className="w-3.5 h-3.5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              {/* Task Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`
                      text-heading-s font-medium text-text-primary leading-snug mb-1
                      ${
                        task.status === "completed"
                          ? "line-through text-text-secondary"
                          : ""
                      }
                    `}
                    >
                      {task.title}
                    </h3>

                    {/* Task Type Badge */}
                    {isSubtask && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-body-m bg-purple-50 text-purple-700 border border-purple-200">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Subtarea
                      </span>
                    )}
                  </div>

                  {/* Enhanced Status Badge */}
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`
                      inline-flex items-center px-2 py-1 rounded-full text-body-m font-medium
                      ${currentStyles.badge} backdrop-blur-sm
                    `}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          task.status === "pending"
                            ? "bg-yellow-400"
                            : "bg-green-400"
                        }`}
                      />
                      {task.status === "pending" ? "Pendiente" : "Completada"}
                    </span>
                  </div>
                </div>

                {task.description && (
                  <p
                    className={`
                    text-body-m text-text-secondary mb-2 leading-relaxed
                    ${
                      task.status === "completed"
                        ? "line-through opacity-75"
                        : ""
                    }
                  `}
                  >
                    {task.description}
                  </p>
                )}

                {/* Enhanced Task Metadata */}
                <div className="flex items-center flex-wrap gap-2 text-body-m">
                  {/* Creation Time */}
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center">
                      <svg
                        className="w-3.5 h-3.5 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-body-m">
                      {getRelativeTime(task.createdAt)}
                    </span>
                  </div>

                  {/* Subtask Info */}
                  {hasSubtasks && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded bg-purple-50 flex items-center justify-center">
                        <svg
                          className="w-3.5 h-3.5 text-purple-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-body-m font-medium text-text-primary">
                          {task.subtaskCount} sub
                        </span>
                        {task.pendingSubtasks !== undefined &&
                          task.pendingSubtasks > 0 && (
                            <span className="text-yellow-600 text-body-m">
                              ({task.pendingSubtasks} pend.)
                            </span>
                          )}
                      </div>
                    </div>
                  )}

                  {/* Comments Icon - Solo ícono, sin contador */}
                  <button
                    onClick={handleCommentsClick}
                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors group/comment"
                  >
                    <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center group-hover/comment:bg-blue-100 transition-colors">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="pt-3 border-t border-lines-light">
              {/* Desktop Layout */}
              <div className="hidden sm:flex sm:items-center sm:justify-between">
                {/* Left Group - Primary Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleCommentsClick}
                    disabled={isLoading}
                    className="btn-secondary group/btn text-body-m px-3 py-1.5"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5 group-hover/btn:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span>Comentarios</span>
                  </Button>

                  {!task.parentTask && (
                    <Button
                      variant="secondary"
                      onClick={handleAddSubtask}
                      disabled={isLoading}
                      className="btn-secondary group/btn text-body-m px-3 py-1.5"
                    >
                      <svg
                        className="w-4 h-4 mr-1.5 group-hover/btn:scale-110 transition-transform"
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
                      <span>Subtarea</span>
                    </Button>
                  )}
                </div>

                {/* Right Group - Secondary Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleEdit}
                    disabled={isLoading}
                    className="btn-secondary group/btn text-body-m px-3 py-1.5"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5 group-hover/btn:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span>Editar</span>
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="btn-destructive group/btn text-body-m px-3 py-1.5"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5 group-hover/btn:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span>Eliminar</span>
                  </Button>
                </div>
              </div>

              {/* Mobile Layout - Enhanced */}
              <div className="flex sm:hidden gap-1.5">
                <Button
                  variant="secondary"
                  onClick={handleCommentsClick}
                  disabled={isLoading}
                  className="btn-secondary flex-1 flex items-center justify-center px-2 py-2"
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </Button>

                {!task.parentTask && (
                  <Button
                    variant="secondary"
                    onClick={handleAddSubtask}
                    disabled={isLoading}
                    className="btn-secondary flex-1 flex items-center justify-center px-2 py-2"
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </Button>
                )}

                <Button
                  variant="secondary"
                  onClick={handleEdit}
                  disabled={isLoading}
                  className="btn-secondary flex-1 flex items-center justify-center px-2 py-2"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </Button>

                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="btn-destructive flex-1 flex items-center justify-center px-2 py-2"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          title="Confirmar eliminación"
          maxWidth="sm"
          actions={{
            primary: {
              label: "Eliminar",
              onClick: handleConfirmDelete,
              variant: "destructive",
            },
            secondary: {
              label: "Cancelar",
              onClick: handleCloseDeleteModal,
            },
          }}
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-heading-s font-medium text-text-primary mb-2">
                  ¿Estás completamente seguro?
                </h4>
                <p className="text-body-l text-text-secondary">
                  Vas a eliminar la tarea{" "}
                  <strong className="text-text-primary">
                    &quot;{task.title}&quot;
                  </strong>{" "}
                  permanentemente.
                </p>
              </div>
            </div>

            {/* Enhanced Subtask Warning */}
            {task.subtaskCount !== undefined && task.subtaskCount > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-yellow-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-body-l font-medium text-yellow-800 mb-1">
                      ⚠️ Esta acción eliminará subtareas
                    </h4>
                    <p className="text-body-m text-yellow-700">
                      Esta tarea tiene{" "}
                      <strong>
                        {task.subtaskCount} subtarea
                        {task.subtaskCount !== 1 ? "s" : ""}
                      </strong>{" "}
                      que también{" "}
                      {task.subtaskCount === 1
                        ? "será eliminada"
                        : "serán eliminadas"}{" "}
                      permanentemente.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-body-m text-text-secondary flex items-center gap-2">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Esta acción no se puede deshacer.
              </p>
            </div>
          </div>
        </Modal>

        {/* Enhanced Comments Modal */}
        <Modal
          isOpen={showCommentsModal}
          onClose={handleCloseCommentsModal}
          title={`💬 Comentarios - ${task.title}`}
          maxWidth="lg"
        >
          {showCommentsModal && task._id && (
            <CommentSection
              taskId={task._id}
              taskTitle={task.title}
              onCommentCountChange={handleCommentCountChange}
            />
          )}

          {showCommentsModal && !task._id && (
            <div className="flex items-center gap-3 text-red-600 p-6 bg-red-50 rounded-lg">
              <svg
                className="w-5 h-5"
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
              <span className="text-body-l font-medium">
                Error: No se pudo obtener el ID de la tarea
              </span>
            </div>
          )}
        </Modal>
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.task._id === nextProps.task._id &&
      prevProps.task.status === nextProps.task.status &&
      prevProps.task.title === nextProps.task.title &&
      prevProps.task.description === nextProps.task.description &&
      prevProps.task.subtaskCount === nextProps.task.subtaskCount &&
      prevProps.task.pendingSubtasks === nextProps.task.pendingSubtasks &&
      prevProps.task.createdAt === nextProps.task.createdAt &&
      prevProps.task.updatedAt === nextProps.task.updatedAt &&
      prevProps.isLoading === nextProps.isLoading
    );
  }
);

export default TaskCard;
