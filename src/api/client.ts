import axios from "axios";
import { TWELVE_DATA_BASE_URL } from "./endpoints";
import { userErrorMessages } from "@/lib/userMessages";

export const twelveDataClient = axios.create({
  baseURL: TWELVE_DATA_BASE_URL,
});

export function getTwelveDataApiKey() {
  const apiKey = import.meta.env.VITE_TWELVE_DATA_API_KEY;

  if (!apiKey) {
    throw new Error(userErrorMessages.service);
  }

  return apiKey;
}

export function assertSuccessfulResponse(data: unknown) {
  if (!isRecord(data)) {
    return;
  }

  if (data.status === "error") {
    if (import.meta.env.DEV && typeof data.message === "string") {
      console.error("Respuesta de error del proveedor de datos:", data.message);
    }

    throw new Error(userErrorMessages.service);
  }
}

export function parseTwelveDataResponse<T>(
  data: unknown,
  isValid: (value: unknown) => value is T,
  invalidMessage: string = userErrorMessages.service,
) {
  assertSuccessfulResponse(data);

  if (!isValid(data)) {
    throw new Error(invalidMessage);
  }

  return data;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
