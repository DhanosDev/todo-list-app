import React from "react";
import { Button } from "../ui/Button";

export interface HeaderProps {
  user?: {
    name: string;
    email: string;
  };
  onLogout?: () => void;
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

export const Header = ({
  user,
  onLogout,
  onToggleSidebar,
  showSidebarToggle = true,
}: HeaderProps) => {
  return (
    <header
      className="h-16 border-b px-4 flex items-center justify-between"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center gap-4">
        {showSidebarToggle && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        <h1
          className="text-preset-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          Todo List
        </h1>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <p
              className="text-preset-6"
              style={{ color: "var(--color-text-primary)" }}
            >
              {user.name}
            </p>
            <p
              className="text-preset-5 -mt-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {user.email}
            </p>
          </div>

          <Button variant="secondary" onClick={onLogout}>
            Cerrar Sesión
          </Button>
        </div>
      )}
    </header>
  );
};
