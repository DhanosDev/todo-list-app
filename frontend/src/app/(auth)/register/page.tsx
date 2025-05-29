import { Metadata } from "next";
import { AuthGuard, RegisterForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Crear Cuenta | Todo App",
  description: "Crea tu cuenta para empezar a organizar tus tareas",
};

export default function RegisterPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
    </AuthGuard>
  );
}
