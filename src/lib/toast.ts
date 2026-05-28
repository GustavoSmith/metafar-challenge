import { Toast } from "@base-ui/react/toast";
import type { ToastManagerAddOptions } from "@base-ui/react/toast";

export type AppToastType = "success" | "error" | "info" | "warning";
export type AppToastData = {
  type?: AppToastType;
};
type AppToastOptions = Omit<ToastManagerAddOptions<AppToastData>, "data">;

export const toastManager = Toast.createToastManager<AppToastData>();

export const appToast = {
  error(options: AppToastOptions) {
    return toastManager.add({
      priority: "high",
      type: "error",
      ...options,
      data: { type: "error" },
    });
  },
  info(options: AppToastOptions) {
    return toastManager.add({
      type: "info",
      ...options,
      data: { type: "info" },
    });
  },
  success(options: AppToastOptions) {
    return toastManager.add({
      type: "success",
      ...options,
      data: { type: "success" },
    });
  },
  warning(options: AppToastOptions) {
    return toastManager.add({
      type: "warning",
      ...options,
      data: { type: "warning" },
    });
  },
};

