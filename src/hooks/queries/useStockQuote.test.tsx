import * as React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getStockQuote } from "@/api/quotes";
import {
  createTestQueryClient,
  QueryClientWrapper,
} from "@/test/testUtils";
import { appleQuoteParams, appleStockData } from "@/test/fixtures";
import { cacheTimes } from "./cacheConfig";
import { quoteQueryKeys } from "./queryKeys";
import { useStockQuote } from "./useStockQuote";

vi.mock("@/api/quotes", () => ({
  getStockQuote: vi.fn(),
}));

interface QueryTimingOptions {
  refetchInterval?: unknown;
  staleTime?: unknown;
}

function createWrapper(queryClient = createTestQueryClient()) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientWrapper queryClient={queryClient}>
        {children}
      </QueryClientWrapper>
    );
  };
}

describe("useStockQuote", () => {
  beforeEach(() => {
    vi.mocked(getStockQuote).mockResolvedValue(appleStockData);
  });

  it("loads quote data with the expected params", async () => {
    const { result } = renderHook(() => useStockQuote(appleQuoteParams), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(appleStockData);
    expect(getStockQuote).toHaveBeenCalledWith(
      appleQuoteParams,
      expect.any(AbortSignal),
    );
  });

  it("does not call the service when disabled", () => {
    const { result } = renderHook(
      () => useStockQuote({ ...appleQuoteParams, enabled: false }),
      { wrapper: createWrapper() },
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(getStockQuote).not.toHaveBeenCalled();
  });

  it("uses realtime cache options only when realtime is active", () => {
    const queryClient = createTestQueryClient();

    renderHook(() => useStockQuote({ ...appleQuoteParams, realTime: true }), {
      wrapper: createWrapper(queryClient),
    });

    const query = queryClient.getQueryCache().find({
      queryKey: quoteQueryKeys.detail(appleQuoteParams),
    });
    const options = query?.options as QueryTimingOptions | undefined;

    expect(options?.refetchInterval).toBe(5 * cacheTimes.oneMinute);
    expect(options?.staleTime).toBe(0);
  });

  it("uses historical cache options by default", () => {
    const queryClient = createTestQueryClient();

    renderHook(() => useStockQuote(appleQuoteParams), {
      wrapper: createWrapper(queryClient),
    });

    const query = queryClient.getQueryCache().find({
      queryKey: quoteQueryKeys.detail(appleQuoteParams),
    });
    const options = query?.options as QueryTimingOptions | undefined;

    expect(options?.refetchInterval).toBe(false);
    expect(options?.staleTime).toBe(cacheTimes.fiveMinutes);
  });
});
