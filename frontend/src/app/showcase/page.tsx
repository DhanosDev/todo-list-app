"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  LoadingSpinner,
  FullPageSpinner,
  ButtonSpinner,
} from "@/components/ui/LoadingSpinner";
import { Card, TaskCard, FormCard } from "@/components/ui/Card";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export default function ComponentsShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [fullPageSpinner, setFullPageSpinner] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectValue, setSelectValue] = useState("");

  const mockUser = {
    name: "Juan Pérez",
    email: "juan@example.com",
  };

  const selectOptions = [
    { value: "pending", label: "Pendiente" },
    { value: "completed", label: "Completada" },
    { value: "in-progress", label: "En Progreso" },
  ];

  if (fullPageSpinner) {
    return <FullPageSpinner />;
  }

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <section>
          <h1
            className="text-preset-1 mb-8"
            style={{ color: "var(--color-text-primary)" }}
          >
            📚 Components Showcase
          </h1>
          <p
            className="text-preset-5 mb-6"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Galería de todos los componentes UI disponibles en la aplicación
          </p>
        </section>

        {/* Typography Presets */}
        <section>
          <h2
            className="text-preset-2 mb-4"
            style={{ color: "var(--color-text-primary)" }}
          >
            🔤 Typography Presets
          </h2>
          <Card className="space-y-4">
            <div
              className="text-preset-1"
              style={{ color: "var(--color-text-primary)" }}
            >
              Preset 1 - Heading XL (24px/30px/700)
            </div>
            <div
              className="text-preset-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              Preset 2 - Heading L (18px/23px/700)
            </div>
            <div
              className="text-preset-3"
              style={{ color: "var(--color-text-primary)" }}
            >
              Preset 3 - Heading M (15px/19px/700)
            </div>
            <div
              className="text-preset-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              PRESET 4 - HEADING S (12PX/15PX/700/UPPERCASE)
            </div>
            <div
              className="text-preset-5"
              style={{ color: "var(--color-text-primary)" }}
            >
              Preset 5 - Body L (13px/23px/500)
            </div>
            <div
              className="text-preset-6"
              style={{ color: "var(--color-text-primary)" }}
            >
              Preset 6 - Body M (12px/15px/700)
            </div>
          </Card>
        </section>

        {/* Buttons */}
        <section>
          <h2
            className="text-preset-2 mb-4"
            style={{ color: "var(--color-text-primary)" }}
          >
            🔘 Buttons
          </h2>
          <Card className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary-large">Primary Large</Button>
              <Button variant="primary-small">Primary Small</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary-small" disabled>
                Disabled
              </Button>
              <Button variant="primary-small" fullWidth className="max-w-xs">
                Full Width
              </Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant="primary-small">
                <ButtonSpinner />
                Loading Button
              </Button>
            </div>
          </Card>
        </section>

        {/* Loading Spinners */}
        <section>
          <h2
            className="text-preset-2 mb-4"
            style={{ color: "var(--color-text-primary)" }}
          >
            ⏳ Loading Spinners
          </h2>
          <Card>
            <div className="flex items-center gap-8 mb-6">
              <div className="text-center">
                <LoadingSpinner size="sm" />
                <p
                  className="text-preset-6 mt-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Small
                </p>
              </div>
              <div className="text-center">
                <LoadingSpinner size="md" />
                <p
                  className="text-preset-6 mt-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Medium
                </p>
              </div>
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p
                  className="text-preset-6 mt-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Large
                </p>
              </div>
              <div className="text-center">
                <LoadingSpinner size="xl" />
                <p
                  className="text-preset-6 mt-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Extra Large
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8 mb-6">
              <div className="text-center">
                <LoadingSpinner color="primary" />
                <p
                  className="text-preset-6 mt-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Primary
                </p>
              </div>
              <div className="text-center bg-purple-600 p-4 rounded">
                <LoadingSpinner color="white" />
                <p className="text-preset-6 mt-2 text-white">White</p>
              </div>
              <div className="text-center">
                <LoadingSpinner color="gray" />
                <p
                  className="text-preset-6 mt-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Gray
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={() => {
                setFullPageSpinner(true);
                setTimeout(() => setFullPageSpinner(false), 2000);
              }}
            >
              Ver Full Page Spinner (2s)
            </Button>
          </Card>
        </section>

        {/* Cards */}
        <section>
          <h2
            className="text-preset-2 mb-4"
            style={{ color: "var(--color-text-primary)" }}
          >
            🃏 Cards
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card padding="sm">
              <h3
                className="text-preset-3 mb-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                Card Small Padding
              </h3>
              <p
                className="text-preset-5"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Contenido con padding pequeño
              </p>
            </Card>

            <Card padding="md" hover>
              <h3
                className="text-preset-3 mb-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                Card with Hover
              </h3>
              <p
                className="text-preset-5"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Hover para ver efecto
              </p>
            </Card>

            <TaskCard>
              <h3
                className="text-preset-3 mb-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                Task Card
              </h3>
              <p
                className="text-preset-5"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Diseñada para tareas
              </p>
            </TaskCard>
          </div>

          <FormCard className="mt-4 max-w-md">
            <h3
              className="text-preset-3 mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              Form Card
            </h3>
            <p
              className="text-preset-5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Perfecta para formularios con padding grande
            </p>
          </FormCard>
        </section>

        {/* Form Inputs */}
        <section>
          <h2
            className="text-preset-2 mb-4"
            style={{ color: "var(--color-text-primary)" }}
          >
            📝 Form Inputs
          </h2>
          <FormCard className="max-w-md">
            <div className="space-y-4">
              <Input label="Input Normal" placeholder="Escribe algo..." />

              <Input
                label="Input con Error"
                placeholder="Campo con error"
                error="Este campo es requerido"
              />

              <Textarea
                label="Textarea"
                placeholder="Escribe un mensaje largo..."
                rows={3}
              />

              <Select
                label="Select Dropdown"
                options={selectOptions}
                value={selectValue}
                onChange={setSelectValue}
                placeholder="Selecciona una opción..."
              />
            </div>
          </FormCard>
        </section>

        {/* Modal */}
        <section>
          <h2
            className="text-preset-2 mb-4"
            style={{ color: "var(--color-text-primary)" }}
          >
            🪟 Modal
          </h2>
          <Card>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary-small"
                onClick={() => setModalOpen(true)}
              >
                Abrir Modal
              </Button>
            </div>

            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Modal de Ejemplo"
              actions={{
                primary: {
                  label: "Confirmar",
                  onClick: () => setModalOpen(false),
                  variant: "primary-small",
                },
                secondary: {
                  label: "Cancelar",
                  onClick: () => setModalOpen(false),
                },
              }}
            >
              <p
                className="text-preset-5"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Este es el contenido del modal. Puedes poner cualquier cosa
                aquí: formularios, texto, imágenes, etc.
              </p>

              <div className="mt-4">
                <Input placeholder="Input dentro del modal" />
              </div>
            </Modal>
          </Card>
        </section>

        {/* Layout Components */}
        <section>
          <h2
            className="text-preset-2 mb-4"
            style={{ color: "var(--color-text-primary)" }}
          >
            🏗️ Layout Components
          </h2>

          {/* Header Showcase */}
          <div className="mb-6">
            <h3
              className="text-preset-3 mb-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              Header Component
            </h3>
            <Card padding="none" className="overflow-hidden">
              <Header
                user={mockUser}
                onLogout={() => alert("Logout clicked!")}
                onToggleSidebar={() => alert("Sidebar toggle clicked!")}
              />
            </Card>
          </div>

          {/* Sidebar Showcase */}
          <div>
            <h3
              className="text-preset-3 mb-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              Sidebar Component
            </h3>
            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => setSidebarOpen(true)}>
                Mostrar Sidebar
              </Button>
            </div>

            <Sidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </section>

        {/* Color Palette */}
        <section>
          <h2
            className="text-preset-2 mb-4"
            style={{ color: "var(--color-text-primary)" }}
          >
            🎨 Color Palette
          </h2>
          <Card>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-lg mx-auto mb-2"
                  style={{ backgroundColor: "var(--color-main-purple)" }}
                />
                <p
                  className="text-preset-6"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Main Purple
                </p>
              </div>

              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-lg mx-auto mb-2"
                  style={{ backgroundColor: "var(--color-red)" }}
                />
                <p
                  className="text-preset-6"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Red
                </p>
              </div>

              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-lg mx-auto mb-2 border"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                  }}
                />
                <p
                  className="text-preset-6"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Surface
                </p>
              </div>

              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-lg mx-auto mb-2"
                  style={{ backgroundColor: "var(--color-background)" }}
                />
                <p
                  className="text-preset-6"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Background
                </p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
