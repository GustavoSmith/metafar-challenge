import axios from "axios";
import { TWELVE_DATA_BASE_URL } from "./endpoints";
import type { TwelveDataErrorResponse } from "./types";

export const twelveDataClient = axios.create({
  baseURL: TWELVE_DATA_BASE_URL,
});

export function getTwelveDataApiKey() {
  const apiKey = import.meta.env.VITE_TWELVE_DATA_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Falta configurar VITE_TWELVE_DATA_API_KEY para consultar Twelve Data.",
    );
  }

  return apiKey;
}

export function assertSuccessfulResponse<T>(
  data: T | TwelveDataErrorResponse,
): asserts data is T {
  const maybeError = data as Partial<TwelveDataErrorResponse>;

  if (maybeError.status === "error") {
    throw new Error(maybeError.message ?? "Twelve Data devolvió un error.");
  }
}
