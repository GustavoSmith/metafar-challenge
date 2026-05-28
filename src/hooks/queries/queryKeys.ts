import type { StockQuoteParams } from "@/api/types";

export const stockQueryKeys = {
  all: ["stocks"] as const,
  list: () => [...stockQueryKeys.all, "list"] as const,
  data: (symbol: string) => [...stockQueryKeys.all, "data", symbol] as const,
  search: (query: string) =>
    [...stockQueryKeys.all, "search", query.trim()] as const,
};

export const quoteQueryKeys = {
  all: ["quotes"] as const,
  detail: ({ symbol, interval, startDate, endDate }: StockQuoteParams) =>
    [
      ...quoteQueryKeys.all,
      symbol,
      interval,
      startDate ?? null,
      endDate ?? null,
    ] as const,
};
