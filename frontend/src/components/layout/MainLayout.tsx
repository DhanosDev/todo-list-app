import React from "react";
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export interface MainLayoutProps {
  children: ReactNode;
  user?: {
    name: string;
    email: string;
  };
  onLogout?: () => void;
  sidebarContent?: ReactNode;
}

export const MainLayout = ({
  children,
  user,
  onLogout,
  sidebarContent,
}: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Header
        user={user}
        onLogout={onLogout}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
          {sidebarContent}
        </Sidebar>

        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
