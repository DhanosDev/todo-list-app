"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Home() {
  const { user, loading, logout, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Todo List App</h1>

        {isAuthenticated ? (
          <div className="text-center">
            <p className="mb-4">Welcome, {user?.name}!</p>
            <div className="space-y-4">
              <Link
                href="/tasks"
                className="block w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Go to Tasks
              </Link>
              <button
                onClick={logout}
                className="block w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Link
              href="/login"
              className="block w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-center"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="block w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 text-center"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
