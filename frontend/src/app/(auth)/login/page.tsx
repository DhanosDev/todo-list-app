import { Metadata } from "next";
import { AuthGuard, LoginForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Iniciar Sesión | Todo App",
  description: "Inicia sesión en tu cuenta para gestionar tus tareas",
};

export default function LoginPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </AuthGuard>
  );
}
