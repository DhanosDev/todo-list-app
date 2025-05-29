import { ReactNode } from "react";

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  children?: ReactNode;
}

export const Sidebar = ({ isOpen = true, onClose, children }: SidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose}>
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-16 bottom-0 z-50 w-64 transform transition-transform lg:translate-x-0 lg:relative lg:top-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div
          className="h-full border-r"
          style={{ borderColor: "var(--color-border)" }}
        >
          <nav className="p-4 space-y-2">
            <SidebarItem
              icon={
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              }
              label="Mis Tareas"
              active={true}
            />

            <SidebarItem
              icon={
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              label="Completadas"
            />

            {children}
          </nav>
        </div>
      </aside>
    </>
  );
};

// Sidebar Item Component
interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({
  icon,
  label,
  active = false,
  onClick,
}: SidebarItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left
        ${active ? "bg-main-purple/10" : "hover:bg-gray-100"}
      `}
      style={{
        color: active
          ? "var(--color-main-purple)"
          : "var(--color-text-secondary)",
        backgroundColor: active ? "rgba(99, 95, 199, 0.1)" : undefined,
      }}
    >
      {icon}
      <span className="text-preset-6">{label}</span>
    </button>
  );
};
