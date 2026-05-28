import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: Infinity,
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

interface QueryClientWrapperProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

export function QueryClientWrapper({
  children,
  queryClient = createTestQueryClient(),
}: QueryClientWrapperProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

interface RenderWithClientOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
}

export function renderWithClient(
  ui: React.ReactElement,
  { queryClient = createTestQueryClient(), ...options }: RenderWithClientOptions = {},
) {
  return {
    queryClient,
    ...render(ui, {
      wrapper: ({ children }) => (
        <QueryClientWrapper queryClient={queryClient}>
          {children}
        </QueryClientWrapper>
      ),
      ...options,
    }),
  };
}
