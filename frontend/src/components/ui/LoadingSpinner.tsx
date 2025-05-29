import React from "react";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "white" | "gray";
  className?: string;
}

export const LoadingSpinner = ({
  size = "md",
  color = "primary",
  className = "",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colorStyles = {
    primary: { color: "var(--color-primary)" },
    white: { color: "var(--color-white)" },
    gray: { color: "var(--color-medium-grey)" },
  };

  return (
    <div className={`inline-block ${className}`}>
      <svg
        className={`animate-spin ${sizeClasses[size]}`}
        style={colorStyles[color]}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

// Componente de página completa para estados de carga
export const FullPageSpinner = () => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p
          className="text-preset-5 mt-4"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Cargando...
        </p>
      </div>
    </div>
  );
};

// Componente inline para botones con loading
export const ButtonSpinner = () => {
  return <LoadingSpinner size="sm" color="white" className="mr-2" />;
};
