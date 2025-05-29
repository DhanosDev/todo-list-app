import React, { ReactNode, ButtonHTMLAttributes } from "react";

export type ButtonVariant =
  | "primary-large"
  | "primary-small"
  | "secondary"
  | "destructive";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
}

export const Button = ({
  children,
  variant,
  fullWidth = false,
  disabled = false,
  className = "",
  ...props
}: ButtonProps) => {
  const baseClass = `btn-${variant}`;

  const fullWidthClass = fullWidth ? "btn-full" : "";
  const disabledClass = disabled ? "btn-disabled" : "";

  return (
    <button
      className={`${baseClass} ${fullWidthClass} ${disabledClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
