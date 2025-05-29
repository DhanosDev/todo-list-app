import React, { ReactNode, useEffect } from "react";
import { Button } from "./Button";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  actions?: {
    primary?: {
      label: string;
      onClick: () => void;
      loading?: boolean;
      variant?: "primary-large" | "primary-small" | "destructive";
    };
    secondary?: {
      label: string;
      onClick: () => void;
    };
  };
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  maxWidth = "md",
  actions,
}: ModalProps) => {
  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        className={`
          relative w-full ${maxWidthClasses[maxWidth]} 
          rounded-lg shadow-lg
        `}
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 pb-4">
            {title && (
              <h2
                className="text-preset-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-4">{children}</div>

        {/* Actions */}
        {actions && (
          <div
            className="flex gap-3 p-6 pt-4 border-t"
            style={{ borderColor: "var(--color-border)" }}
          >
            {actions.secondary && (
              <Button
                variant="secondary"
                onClick={actions.secondary.onClick}
                className="flex-1"
              >
                {actions.secondary.label}
              </Button>
            )}
            {actions.primary && (
              <Button
                variant={actions.primary.variant || "primary-small"}
                onClick={actions.primary.onClick}
                disabled={actions.primary.loading}
                className="flex-1"
              >
                {actions.primary.loading
                  ? "Cargando..."
                  : actions.primary.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
