import { useQuery } from "@tanstack/react-query";
import { getStockList } from "@/api/stocks";
import type { IStock } from "@/api/types";
import { cacheTimes } from "./cacheConfig";
import { stockQueryKeys } from "./queryKeys";

export function useStockList() {
  return useQuery<IStock[]>({
    queryKey: stockQueryKeys.list(),
    queryFn: ({ signal }) => getStockList(undefined, signal),
    gcTime: cacheTimes.oneDay,
    staleTime: Infinity,
  });
}
