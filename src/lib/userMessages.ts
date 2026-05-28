import axios from "axios";

export const userErrorMessages = {
  appCrash:
    "La aplicación tuvo un problema inesperado. Podés reintentar para continuar.",
  stockList:
    "No pudimos cargar el listado de acciones. Probá de nuevo en unos momentos.",
  stockData: "No pudimos cargar la información de esta acción.",
  stockSearch: "No pudimos completar la búsqueda en este momento.",
  stockQuote:
    "No pudimos cargar los datos del gráfico. Revisá los filtros e intentá nuevamente.",
  network:
    "Parece que hay un problema de conexión. Verificá tu internet e intentá de nuevo.",
  service:
    "No pudimos obtener los datos en este momento. Intentá nuevamente más tarde.",
} as const;

export type UserErrorContext = keyof typeof userErrorMessages;

export function getUserFriendlyMessage(
  error: unknown,
  context: UserErrorContext,
): string {
  if (import.meta.env.DEV && error) {
    console.error(`[${context}]`, error);
  }

  if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
    return userErrorMessages[context];
  }

  if (axios.isAxiosError(error)) {
    return userErrorMessages.network;
  }

  return userErrorMessages[context];
}
