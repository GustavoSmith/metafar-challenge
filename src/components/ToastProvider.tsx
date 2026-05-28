import * as React from "react";
import { Toast } from "@base-ui/react/toast";
import type { ToastObject } from "@base-ui/react/toast";
import { cn } from "@/lib/utils";
import { toastManager, type AppToastData, type AppToastType } from "@/lib/toast";

const toastClasses: Record<AppToastType, string> = {
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-blue-200 bg-blue-50 text-blue-900",
  success: "border-green-200 bg-green-50 text-green-900",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-900",
};

interface AppToastProviderProps {
  children: React.ReactNode;
}

function getToastClassName(toast: ToastObject<AppToastData>) {
  const type = toast.data?.type ?? "info";

  return cn(
    "pointer-events-auto w-[min(420px,calc(100vw-2rem))] rounded-md border p-4 shadow-lg",
    toastClasses[type],
  );
}

function ToastViewport() {
  const toast = Toast.useToastManager<AppToastData>();

  return (
    <Toast.Portal>
      <Toast.Viewport className="fixed right-4 bottom-4 z-50 flex flex-col gap-2 outline-none">
        {toast.toasts.map((item) => (
          <Toast.Root
            key={item.id}
            toast={item}
            className={getToastClassName(item)}
          >
            <Toast.Content className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {item.title && (
                  <Toast.Title className="mb-1 text-sm font-semibold">
                    {item.title}
                  </Toast.Title>
                )}
                {item.description && (
                  <Toast.Description className="text-sm">
                    {item.description}
                  </Toast.Description>
                )}
              </div>
              <Toast.Close className="rounded px-2 text-sm opacity-70 hover:opacity-100">
                Cerrar
              </Toast.Close>
            </Toast.Content>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

export default function AppToastProvider({ children }: AppToastProviderProps) {
  return (
    <Toast.Provider limit={3} timeout={5000} toastManager={toastManager}>
      {children}
      <ToastViewport />
    </Toast.Provider>
  );
}

