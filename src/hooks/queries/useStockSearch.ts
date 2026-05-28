/* Decisión de alcance:
 La tabla filtra localmente sobre la lista NASDAQ ya cargada, así evitamos
 llamadas remotas extra para una búsqueda que hoy no aporta más valor.
 Dejamos este hook comentado como referencia si más adelante se decide
 conectar una búsqueda remota real contra Symbol Search.

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
*/
