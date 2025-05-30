import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface CommentFormData {
  content: string;
}

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialValue?: string;
  placeholder?: string;
  submitText?: string;
  cancelText?: string;
  showCancel?: boolean;
  autoFocus?: boolean;
}

export function CommentForm({
  onSubmit,
  onCancel,
  isLoading = false,
  initialValue = "",
  placeholder = "Escribe tu comentario...",
  submitText = "Comentar",
  cancelText = "Cancelar",
  showCancel = false,
  autoFocus = false,
}: CommentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
  } = useForm<CommentFormData>({
    defaultValues: {
      content: initialValue,
    },
    mode: "onChange",
  });

  const contentValue = watch("content");
  const isEmptyContent = !contentValue?.trim();

  const handleFormSubmit = async (data: CommentFormData) => {
    if (isEmptyContent || isLoading) return;

    try {
      await onSubmit(data.content.trim());
      reset();
    } catch (error) {
      console.error("Comment form submission error:", error);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
      {/* Comment Textarea */}
      <div>
        <textarea
          {...register("content", {
            required: "El comentario es requerido",
            minLength: {
              value: 1,
              message: "El comentario no puede estar vacío",
            },
            maxLength: {
              value: 300,
              message: "El comentario no puede exceder 300 caracteres",
            },
          })}
          placeholder={placeholder}
          rows={3}
          autoFocus={autoFocus}
          disabled={isLoading}
          className={`
            w-full px-3 py-2 border rounded-lg resize-none
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              errors.content
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300"
            }
          `}
        />

        {/* Character Counter */}
        <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
          <div>
            {errors.content && (
              <span className="text-red-500">{errors.content.message}</span>
            )}
          </div>
          <div>{contentValue?.length || 0}/300</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        {showCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
        )}

        <Button
          type="submit"
          variant="primary-small"
          disabled={isLoading || !isValid || isEmptyContent}
          className="min-w-[100px]"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" color="white" />
              <span>Enviando...</span>
            </div>
          ) : (
            submitText
          )}
        </Button>
      </div>
    </form>
  );
}

interface QuickCommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
}

export function QuickCommentForm({
  onSubmit,
  isLoading = false,
  placeholder = "Agregar un comentario...",
}: QuickCommentFormProps) {
  return (
    <CommentForm
      onSubmit={onSubmit}
      isLoading={isLoading}
      placeholder={placeholder}
      submitText="Comentar"
      autoFocus={false}
    />
  );
}

interface EditCommentFormProps {
  initialContent: string;
  onSubmit: (content: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EditCommentForm({
  initialContent,
  onSubmit,
  onCancel,
  isLoading = false,
}: EditCommentFormProps) {
  return (
    <CommentForm
      onSubmit={onSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
      initialValue={initialContent}
      placeholder="Editar comentario..."
      submitText="Guardar"
      cancelText="Cancelar"
      showCancel={true}
      autoFocus={true}
    />
  );
}
