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
    const [commentCount, setCommentCount] = useState(0);

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
          badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
          checkbox: "border-gray-300 hover:border-yellow-400",
          card: "hover:border-yellow-200",
          bgOpacity: "bg-opacity-100",
        },
        completed: {
          badge: "bg-green-100 text-green-800 border-green-200",
          checkbox: "bg-green-500 border-green-500",
          card: "hover:border-green-200",
          bgOpacity: "bg-opacity-95",
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

    return (
      <>
        {/* Task Card */}
        <div
          className={`
        bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200
        ${currentStyles.card} ${currentStyles.bgOpacity}
        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
      `}
        >
          <div className="p-5">
            {/* Task Header */}
            <div className="flex items-start gap-4 mb-4">
              {/* Status Checkbox */}
              <button
                onClick={handleStatusToggle}
                disabled={
                  isLoading || (task.status === "pending" && !canComplete)
                }
                className={`
                flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200
                ${
                  task.status === "completed"
                    ? "bg-green-500 border-green-500 hover:bg-green-600 shadow-sm"
                    : canComplete
                    ? "border-gray-300 hover:border-green-400 hover:bg-green-50"
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
              </button>

              {/* Task Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3
                    className={`
                    text-heading-m text-gray-900 leading-snug
                    ${
                      task.status === "completed"
                        ? "line-through text-gray-500"
                        : ""
                    }
                  `}
                  >
                    {task.title}
                  </h3>

                  {/* Status Badge */}
                  <span
                    className={`
                    inline-flex items-center px-3 py-1 rounded-full text-body-m border flex-shrink-0
                    ${currentStyles.badge}
                  `}
                  >
                    {task.status === "pending" ? "Pendiente" : "Completada"}
                  </span>
                </div>

                {task.description && (
                  <p
                    className={`
                    text-body-l text-gray-600 mb-3 leading-relaxed
                    ${
                      task.status === "completed"
                        ? "line-through text-gray-400"
                        : ""
                    }
                  `}
                  >
                    {task.description}
                  </p>
                )}

                {/* Task Metadata */}
                <div className="flex items-center flex-wrap gap-3 text-body-m text-gray-500">
                  <div className="flex items-center gap-1">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{getRelativeTime(task.createdAt)}</span>
                  </div>

                  {/* Subtask Info */}
                  {hasSubtasks && (
                    <div className="flex items-center gap-1">
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
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                      <span
                        className={
                          task.pendingSubtasks !== undefined &&
                          task.pendingSubtasks > 0
                            ? "text-yellow-600 font-medium"
                            : "text-green-600 font-medium"
                        }
                      >
                        {task.subtaskCount} subtarea
                        {task.subtaskCount !== 1 ? "s" : ""}
                        {task.pendingSubtasks !== undefined &&
                          task.pendingSubtasks > 0 && (
                            <span className="text-yellow-600 ml-1">
                              ({task.pendingSubtasks} pendiente
                              {task.pendingSubtasks !== 1 ? "s" : ""})
                            </span>
                          )}
                      </span>
                    </div>
                  )}

                  {/* Comments Count */}
                  {commentCount > 0 && (
                    <button
                      onClick={handleCommentsClick}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
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
                      <span className="font-medium">
                        {commentCount} comentario{commentCount !== 1 ? "s" : ""}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-100">
              {/* Desktop Layout */}
              <div className="hidden sm:flex sm:items-center sm:justify-between">
                {/* Left Group - Primary Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleCommentsClick}
                    disabled={isLoading}
                    className="text-gray-600 hover:text-blue-600 text-body-l px-4 py-2"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
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
                    Comentarios
                  </Button>

                  {!task.parentTask && (
                    <Button
                      variant="secondary"
                      onClick={handleAddSubtask}
                      disabled={isLoading}
                      className="text-gray-600 hover:text-purple-600 text-body-l px-4 py-2"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
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
                      Subtarea
                    </Button>
                  )}
                </div>

                {/* Right Group - Secondary Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleEdit}
                    disabled={isLoading}
                    className="text-gray-600 hover:text-blue-600 text-body-l px-4 py-2"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
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
                    Editar
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="text-gray-600 hover:text-red-600 text-body-l px-4 py-2"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
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
                    Eliminar
                  </Button>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="flex sm:hidden gap-2">
                <Button
                  variant="secondary"
                  onClick={handleCommentsClick}
                  disabled={isLoading}
                  className="text-gray-600 hover:text-blue-600 flex-1 px-3 py-2.5"
                >
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </Button>

                {!task.parentTask && (
                  <Button
                    variant="secondary"
                    onClick={handleAddSubtask}
                    disabled={isLoading}
                    className="text-gray-600 hover:text-purple-600 flex-1 px-3 py-2.5"
                  >
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </Button>
                )}

                <Button
                  variant="secondary"
                  onClick={handleEdit}
                  disabled={isLoading}
                  className="text-gray-600 hover:text-blue-600 flex-1 px-3 py-2.5"
                >
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </Button>

                <Button
                  variant="secondary"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="text-gray-600 hover:text-red-600 flex-1 px-3 py-2.5"
                >
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
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
          <div className="space-y-3">
            <p className="text-body-l text-gray-700">
              ¿Estás seguro que deseas eliminar la tarea &quot;
              <strong>{task.title}</strong>&quot;?
            </p>

            {/* Advertencia de subtareas */}
            {task.subtaskCount !== undefined && task.subtaskCount > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-yellow-400 mt-0.5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1">
                    <h4 className="text-body-l text-yellow-800 font-medium">
                      Esta acción eliminará subtareas
                    </h4>
                    <p className="text-body-l text-yellow-700 mt-1">
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

            <p className="text-body-m text-gray-500">
              Esta acción no se puede deshacer.
            </p>
          </div>
        </Modal>

        {/* Comments Modal */}
        <Modal
          isOpen={showCommentsModal}
          onClose={handleCloseCommentsModal}
          title="Comentarios"
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
            <div className="text-red-500 p-4 text-body-l">
              Error: No se pudo obtener el ID de la tarea
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
