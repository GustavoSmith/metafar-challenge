import { MemoryRouter } from "react-router-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useStockList } from "@/hooks/queries/useStockList";
import { stockQueryKeys } from "@/hooks/queries/queryKeys";
import { renderWithClient } from "@/test/testUtils";
import { rawProviderError, stockList } from "@/test/fixtures";
import StockTable from "./StockTable";

vi.mock("@tanstack/react-virtual", () => ({
  useVirtualizer: ({ count }: { count: number }) => ({
    getVirtualItems: () =>
      Array.from({ length: count }, (_, index) => ({
        index,
        key: index,
        size: 48,
        start: index * 48,
      })),
    getTotalSize: () => count * 48,
  }),
}));

vi.mock("@/hooks/queries/useStockList", () => ({
  useStockList: vi.fn(),
}));

vi.mock("@/lib/toast", () => ({
  appToast: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

function renderStockTable() {
  return renderWithClient(
    <MemoryRouter>
      <StockTable />
    </MemoryRouter>,
  );
}

describe("StockTable", () => {
  beforeEach(() => {
    vi.mocked(useStockList).mockReturnValue({
      data: stockList,
      error: null,
      isError: false,
      isFetching: false,
      isLoading: false,
    } as ReturnType<typeof useStockList>);
  });

  it("shows a skeleton while the stock list is loading", () => {
    vi.mocked(useStockList).mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isFetching: true,
      isLoading: true,
    } as ReturnType<typeof useStockList>);

    renderStockTable();

    expect(screen.getByLabelText("Cargando acciones")).toBeTruthy();
    expect(screen.getByText("Acciones")).toBeTruthy();
  });

  it("shows a friendly error and lets the user retry", () => {
    vi.mocked(useStockList).mockReturnValue({
      data: undefined,
      error: rawProviderError,
      isError: true,
      isFetching: false,
      isLoading: false,
    } as ReturnType<typeof useStockList>);

    const { queryClient } = renderStockTable();
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");

    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(
      screen.getByText(
        "No pudimos cargar el listado de acciones. Probá de nuevo en unos momentos.",
      ),
    ).toBeTruthy();
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: stockQueryKeys.list(),
    });
  });

  it("renders and filters the stock list by symbol", async () => {
    renderStockTable();

    expect(screen.getByText("Apple Inc.")).toBeTruthy();
    expect(screen.getByText("Microsoft Corporation")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Buscar por símbolo"), {
      target: { value: "MSFT" },
    });

    await waitFor(
      () => {
        expect(screen.queryByText("Apple Inc.")).toBeNull();
        expect(screen.getByText("Microsoft Corporation")).toBeTruthy();
      },
      { timeout: 1000 },
    );
  });
});
