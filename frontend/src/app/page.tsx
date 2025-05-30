"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button, Card, LoadingSpinner } from "@/components/ui";

export default function Home() {
  const { user, isLoading, logout, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-body-l text-text-secondary mt-4">
            Cargando aplicación...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-surface border-b border-lines-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <h1 className="text-heading-l font-bold text-main-purple">
                📋 TodoApp
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-body-m text-text-secondary">
                    Hola, {user?.name}
                  </span>
                  <Link href="/tasks">
                    <Button variant="primary-large">Ir a mis tareas</Button>
                  </Link>
                  <Button variant="secondary" onClick={logout}>
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="secondary">Iniciar Sesión</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary-large">Registrarse</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-background py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-heading-xl font-bold text-text-primary mb-6 leading-tight">
                Organiza tus tareas de manera{" "}
                <span className="text-main-purple">inteligente</span>
              </h1>
              <p className="text-body-l text-text-secondary mb-8 max-w-lg">
                La aplicación de gestión de tareas que te ayuda a mantener el
                control de tus proyectos con subtareas, comentarios y una
                interfaz intuitiva.
              </p>

              {isAuthenticated ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/tasks">
                    <Button
                      variant="primary-large"
                      className="w-full sm:w-auto"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg>
                      Ver mis tareas
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="secondary" className="w-full sm:w-auto">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Mi perfil
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/register">
                    <Button
                      variant="primary-large"
                      className="w-full sm:w-auto"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      Comenzar gratis
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="secondary" className="w-full sm:w-auto">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      Iniciar sesión
                    </Button>
                  </Link>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start space-x-8 mt-12 pt-8 border-t border-lines-light">
                <div className="text-center">
                  <div className="text-heading-l font-bold text-main-purple">
                    100%
                  </div>
                  <div className="text-body-m text-text-secondary">
                    Gratuito
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-heading-l font-bold text-main-purple">
                    ⚡
                  </div>
                  <div className="text-body-m text-text-secondary">Rápido</div>
                </div>
                <div className="text-center">
                  <div className="text-heading-l font-bold text-main-purple">
                    🔒
                  </div>
                  <div className="text-body-m text-text-secondary">Seguro</div>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="relative lg:ml-8">
              <Card
                padding="lg"
                className="shadow-lg bg-surface relative overflow-hidden"
              >
                {/* Mock Task List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-heading-m font-medium text-text-primary">
                      Mis Tareas
                    </h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    </div>
                  </div>

                  {/* Mock tasks */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-background rounded-lg">
                      <div className="w-5 h-5 bg-green-500 rounded border-2 border-green-500 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-body-l text-text-secondary line-through">
                          Completar diseño de landing
                        </div>
                        <div className="text-body-m text-text-secondary">
                          2 subtareas completadas
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-main-purple">
                      <div className="w-5 h-5 border-2 border-main-purple rounded"></div>
                      <div className="flex-1">
                        <div className="text-body-l text-text-primary font-medium">
                          Implementar autenticación JWT
                        </div>
                        <div className="text-body-m text-main-purple">
                          1 de 3 subtareas
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-background rounded-lg">
                      <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                      <div className="flex-1">
                        <div className="text-body-l text-text-primary">
                          Optimizar performance
                        </div>
                        <div className="text-body-m text-text-secondary">
                          0 comentarios
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-lines-light">
                    <div className="flex items-center justify-between text-body-m text-text-secondary">
                      <span>3 tareas total</span>
                      <span>1 completada</span>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-main-purple rounded-full flex items-center justify-center text-white font-bold text-sm">
                  ✓
                </div>
              </Card>

              {/* Background decoration */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-main-purple/5 to-main-purple-hover/5 rounded-3xl transform rotate-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-heading-l font-bold text-text-primary mb-4">
              Todo lo que necesitas para ser productivo
            </h2>
            <p className="text-body-l text-text-secondary max-w-2xl mx-auto">
              Herramientas poderosas y una interfaz simple que te ayudan a
              mantener el foco en lo que realmente importa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card
              padding="lg"
              className="text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-heading-m font-medium text-text-primary mb-2">
                Gestión Simple
              </h3>
              <p className="text-body-l text-text-secondary">
                Crea, edita y organiza tus tareas con una interfaz intuitiva.
                Marca como completadas con un solo clic.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card
              padding="lg"
              className="text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-heading-m font-medium text-text-primary mb-2">
                Subtareas Inteligentes
              </h3>
              <p className="text-body-l text-text-secondary">
                Divide proyectos grandes en subtareas manejables. El sistema
                controla automáticamente las dependencias.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card
              padding="lg"
              className="text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-main-purple"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-heading-m font-medium text-text-primary mb-2">
                Comentarios y Notas
              </h3>
              <p className="text-body-l text-text-secondary">
                Agrega comentarios y notas a tus tareas. Mantén toda la
                información importante en un solo lugar.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card
              padding="lg"
              className="text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </div>
              <h3 className="text-heading-m font-medium text-text-primary mb-2">
                Filtros Inteligentes
              </h3>
              <p className="text-body-l text-text-secondary">
                Filtra tus tareas por estado y tipo. Enfócate en lo que
                necesitas hacer ahora.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card
              padding="lg"
              className="text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-heading-m font-medium text-text-primary mb-2">
                Seguro y Privado
              </h3>
              <p className="text-body-l text-text-secondary">
                Tus datos están protegidos con autenticación segura. Solo tú
                puedes ver y gestionar tus tareas.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card
              padding="lg"
              className="text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-heading-m font-medium text-text-primary mb-2">
                Diseño Responsivo
              </h3>
              <p className="text-body-l text-text-secondary">
                Funciona perfectamente en todos tus dispositivos. Gestiona tus
                tareas desde donde estés.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-heading-l font-bold text-text-primary mb-4">
              ¿Listo para ser más productivo?
            </h2>
            <p className="text-body-l text-text-secondary mb-8 max-w-2xl mx-auto">
              Únete a miles de usuarios que ya organizan su vida con TodoApp. Es
              gratis y solo toma un minuto registrarse.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button variant="primary-large" className="w-full sm:w-auto">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  Comenzar ahora
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" className="w-full sm:w-auto">
                  ¿Ya tienes cuenta? Inicia sesión
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-surface border-t border-lines-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <h3 className="text-heading-m font-bold text-main-purple">
                  📋 TodoApp
                </h3>
              </div>
              <p className="text-body-l text-text-secondary mb-4 max-w-md">
                La herramienta de gestión de tareas más simple y efectiva.
                Organiza tu vida, alcanza tus metas.
              </p>
              <div className="flex space-x-4">
                <span className="text-body-m text-text-secondary">
                  © 2025 TodoApp. Todos los derechos reservados.
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-heading-s font-medium text-text-primary mb-4">
                Producto
              </h4>
              <div className="space-y-2">
                <Link
                  href="/features"
                  className="block text-body-l text-text-secondary hover:text-main-purple transition-colors"
                >
                  Características
                </Link>
                <Link
                  href="/pricing"
                  className="block text-body-l text-text-secondary hover:text-main-purple transition-colors"
                >
                  Precios
                </Link>
                <Link
                  href="/updates"
                  className="block text-body-l text-text-secondary hover:text-main-purple transition-colors"
                >
                  Actualizaciones
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-heading-s font-medium text-text-primary mb-4">
                Soporte
              </h4>
              <div className="space-y-2">
                <Link
                  href="/help"
                  className="block text-body-l text-text-secondary hover:text-main-purple transition-colors"
                >
                  Centro de ayuda
                </Link>
                <Link
                  href="/contact"
                  className="block text-body-l text-text-secondary hover:text-main-purple transition-colors"
                >
                  Contacto
                </Link>
                <Link
                  href="/privacy"
                  className="block text-body-l text-text-secondary hover:text-main-purple transition-colors"
                >
                  Privacidad
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
