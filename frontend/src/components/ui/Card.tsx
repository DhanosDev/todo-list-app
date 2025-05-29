import React, { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  border?: boolean;
  shadow?: "none" | "sm" | "md" | "lg";
}

export const Card = ({
  children,
  className = "",
  padding = "md",
  hover = false,
  border = true,
  shadow = "sm",
}: CardProps) => {
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  };

  const hoverClass = hover
    ? "hover:shadow-md transition-shadow duration-150"
    : "";
  const borderClass = border ? "border" : "";

  return (
    <div
      className={`
        rounded-lg
        ${paddingClasses[padding]}
        ${shadowClasses[shadow]}
        ${hoverClass}
        ${borderClass}
        ${className}
      `}
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: border ? "var(--color-border)" : "transparent",
      }}
    >
      {children}
    </div>
  );
};

// Variantes específicas para casos comunes
export const TaskCard = ({
  children,
  className = "",
  ...props
}: Omit<CardProps, "padding" | "hover">) => {
  return (
    <Card
      padding="md"
      hover={true}
      className={`cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </Card>
  );
};

export const FormCard = ({
  children,
  className = "",
  ...props
}: Omit<CardProps, "padding">) => {
  return (
    <Card padding="lg" className={className} {...props}>
      {children}
    </Card>
  );
};
