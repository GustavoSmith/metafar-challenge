import { MemoryRouter, Route, Routes } from "react-router-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IStockData } from "@/api/types";
import { useStockData } from "@/hooks/queries/useStockData";
import { useStockQuote } from "@/hooks/queries/useStockQuote";
import { renderWithClient } from "@/test/testUtils";
import { meliStock, meliStockData } from "@/test/fixtures";
import Detail from "./Detail";

vi.mock("@/hooks/queries/useStockData", () => ({
  useStockData: vi.fn(),
}));

vi.mock("@/hooks/queries/useStockQuote", () => ({
  useStockQuote: vi.fn(),
}));

vi.mock("@/lib/toast", () => ({
  appToast: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("./StockChart", () => ({
  default: ({ stockData }: { stockData: IStockData }) => (
    <div>Gráfico para {stockData.meta.symbol}</div>
  ),
}));

function renderDetail() {
  return renderWithClient(
    <MemoryRouter initialEntries={["/stock/MELI"]}>
      <Routes>
        <Route path="/stock/:symbol" element={<Detail />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Detail", () => {
  beforeEach(() => {
    vi.mocked(useStockData).mockReturnValue({
      data: meliStock,
      error: null,
      isError: false,
      isLoading: false,
    } as ReturnType<typeof useStockData>);

    vi.mocked(useStockQuote).mockReturnValue({
      data: meliStockData,
      error: null,
      isError: false,
      isFetching: false,
      isLoading: false,
    } as ReturnType<typeof useStockQuote>);
  });

  it("renders the chart when quote data is available", async () => {
    renderDetail();

    expect(await screen.findByText("Gráfico para MELI")).toBeTruthy();
  });

  it("pauses realtime updates without losing current chart data", async () => {
    renderDetail();

    fireEvent.click(screen.getByRole("button", { name: "Pausar" }));

    await waitFor(() => {
      expect(useStockQuote).toHaveBeenLastCalledWith(
        expect.objectContaining({
          symbol: "MELI",
          realTime: false,
        }),
      );
    });
    expect(screen.getByText("Gráfico para MELI")).toBeTruthy();
  });

  it("shows a chart skeleton during the initial quote load", () => {
    vi.mocked(useStockQuote).mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isFetching: true,
      isLoading: true,
    } as ReturnType<typeof useStockQuote>);

    const { container } = renderDetail();

    expect(container.querySelector(".animate-pulse")).toBeTruthy();
    expect(screen.queryByText("Gráfico para MELI")).toBeNull();
  });
});
