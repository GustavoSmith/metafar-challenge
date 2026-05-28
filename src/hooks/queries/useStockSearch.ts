import { useQuery } from "@tanstack/react-query";
import { searchStocks } from "@/api/stocks";
import { cacheTimes } from "./cacheConfig";
import { stockQueryKeys } from "./queryKeys";

export function useStockSearch(query: string) {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: stockQueryKeys.search(normalizedQuery),
    queryFn: ({ signal }) => searchStocks({ query: normalizedQuery }, signal),
    enabled: normalizedQuery.length > 1,
    gcTime: cacheTimes.fiveMinutes,
    staleTime: cacheTimes.oneMinute,
  });
}
