import { QueryClient } from "@tanstack/react-query";

const DEFAULT_STALE_TIME = 30 * 1000;
const DEFAULT_GC_TIME = 30 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: DEFAULT_GC_TIME,
      refetchOnWindowFocus: false,
      retry: 2,
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 30 * 1000),
      staleTime: DEFAULT_STALE_TIME,
    },
    mutations: {
      retry: 0,
    },
  },
});
