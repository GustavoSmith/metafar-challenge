import { describe, expect, it } from "vitest";
import {
  isStockData,
  isStockListResponse,
  isStockSearchResponse,
} from "./guards";
import {
  appleStockData,
  appleStockSearchResponse,
  malformedStockData,
  malformedStockListResponse,
  stockListResponse,
} from "@/test/fixtures";

describe("API response guards", () => {
  it("accepts a valid stock list response", () => {
    expect(isStockListResponse(stockListResponse)).toBe(true);
  });

  it("rejects a stock list with incomplete items", () => {
    expect(isStockListResponse(malformedStockListResponse)).toBe(false);
  });

  it("accepts a valid symbol search response", () => {
    expect(isStockSearchResponse(appleStockSearchResponse)).toBe(true);
  });

  it("accepts a valid time series response", () => {
    expect(isStockData(appleStockData)).toBe(true);
  });

  it("rejects malformed time series values", () => {
    expect(isStockData(malformedStockData)).toBe(false);
  });
});
