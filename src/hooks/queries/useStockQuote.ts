import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getStockQuote } from "@/api/quotes";
import type { StockQuoteParams } from "@/api/types";
import { cacheTimes } from "./cacheConfig";
import { quoteQueryKeys } from "./queryKeys";

interface UseStockQuoteParams extends StockQuoteParams {
  enabled?: boolean;
  realTime?: boolean;
}

function getRefetchInterval(interval: string) {
  const intervalInMs: Record<string, number> = {
    "1min": cacheTimes.oneMinute,
    "5min": 5 * cacheTimes.oneMinute,
    "15min": 15 * cacheTimes.oneMinute,
    "30min": 30 * cacheTimes.oneMinute,
    "45min": 45 * cacheTimes.oneMinute,
    "1h": cacheTimes.oneHour,
  };

  return intervalInMs[interval] ?? 5 * cacheTimes.oneMinute;
}

export function useStockQuote({
  enabled = true,
  realTime = false,
  ...params
}: UseStockQuoteParams) {
  return useQuery({
    queryKey: quoteQueryKeys.detail(params),
    queryFn: ({ signal }) => getStockQuote(params, signal),
    enabled: enabled && Boolean(params.symbol),
    placeholderData: keepPreviousData,
    refetchInterval: realTime ? getRefetchInterval(params.interval) : false,
    staleTime: realTime ? 0 : cacheTimes.fiveMinutes,
  });
}
