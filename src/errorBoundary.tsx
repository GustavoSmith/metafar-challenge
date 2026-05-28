import * as React from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import {
  ErrorBoundary,
  type FallbackProps,
} from "react-error-boundary";

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const message =
    error instanceof Error
      ? error.message
      : "La aplicación encontró un error inesperado.";

  return (
    <main
      role="alert"
      className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 p-6 text-center"
    >
      <div>
        <h1 className="mb-2 text-2xl font-semibold">Algo salió mal</h1>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Reintentar
      </button>
    </main>
  );
}

export default function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onError={(error, info) => {
            console.error("Error capturado:", error, info.componentStack);
          }}
          onReset={reset}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
