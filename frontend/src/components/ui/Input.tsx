import React, {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
} from "react";

// Input Component
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const inputClass = error ? "input-error" : "input-focus";

    return (
      <div className={`relative ${className}`}>
        {label && <label className="form-label block">{label}</label>}
        <input ref={ref} className={`input-base ${inputClass}`} {...props} />
        {error && <span className="error-message">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

// Textarea Component
export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const textareaClass = error ? "textarea-error" : "textarea-focus";

    return (
      <div className={`relative ${className}`}>
        {label && <label className="form-label block">{label}</label>}
        <textarea
          ref={ref}
          className={`textarea-base ${textareaClass}`}
          {...props}
        />
        {error && <span className="error-message">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

// Select Component (usando tus estilos de dropdown)
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

export const Select = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  error,
  className = "",
}: SelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`}>
      {label && <label className="form-label block">{label}</label>}

      <div className="relative">
        <button
          type="button"
          className={`input-base text-left flex items-center justify-between ${
            error ? "input-error" : "input-focus"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            style={{
              color: selectedOption
                ? "var(--color-text-primary)"
                : "var(--color-medium-grey)",
            }}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            style={{ color: "var(--color-medium-grey)" }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            {options.map((option) => (
              <div
                key={option.value}
                className={`dropdown-option ${
                  value === option.value ? "dropdown-option-selected" : ""
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <span className="error-message">{error}</span>}
    </div>
  );
};
