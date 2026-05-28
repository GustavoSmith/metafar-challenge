import { useQuery } from "@tanstack/react-query";
import { getStockData } from "@/api/stocks";
import { cacheTimes } from "./cacheConfig";
import { stockQueryKeys } from "./queryKeys";

export function useStockData(symbol: string) {
  return useQuery({
    queryKey: stockQueryKeys.data(symbol),
    queryFn: ({ signal }) => getStockData(symbol, signal),
    enabled: Boolean(symbol),
    gcTime: cacheTimes.oneDay,
    staleTime: cacheTimes.oneHour,
  });
}
