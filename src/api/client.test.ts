import { describe, expect, it, vi } from "vitest";
import {
  getTwelveDataApiKey,
  parseTwelveDataResponse,
} from "./client";
import { isStockListResponse } from "./guards";
import { userErrorMessages } from "@/lib/userMessages";
import {
  malformedStockListResponse,
  stockListResponse,
} from "@/test/fixtures";

describe("API client helpers", () => {
  it("reads the API key from env", () => {
    vi.stubEnv("VITE_TWELVE_DATA_API_KEY", "test-api-key");

    expect(getTwelveDataApiKey()).toBe("test-api-key");
  });

  it("throws a friendly setup error when the API key is missing", () => {
    vi.stubEnv("VITE_TWELVE_DATA_API_KEY", "");

    expect(() => getTwelveDataApiKey()).toThrow(userErrorMessages.service);
  });

  it("returns parsed data when the guard accepts the response", () => {
    expect(
      parseTwelveDataResponse(stockListResponse, isStockListResponse),
    ).toEqual(stockListResponse);
  });

  it("throws the provided friendly message for invalid payloads", () => {
    expect(() =>
      parseTwelveDataResponse(
        malformedStockListResponse,
        isStockListResponse,
        userErrorMessages.stockQuote,
      ),
    ).toThrow(userErrorMessages.stockQuote);
  });

  it("does not expose provider details when an API error response arrives", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect(() =>
      parseTwelveDataResponse(
        {
          code: 400,
          message: "provider-specific error",
          status: "error",
        },
        isStockListResponse,
      ),
    ).toThrow(userErrorMessages.service);
  });
});
