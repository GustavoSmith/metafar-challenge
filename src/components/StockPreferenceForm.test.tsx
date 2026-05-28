import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useStockData } from "@/hooks/queries/useStockData";
import { renderWithClient } from "@/test/testUtils";
import { meliStock, rawProviderError } from "@/test/fixtures";
import StockPreferenceForm from "./StockPreferenceForm";

vi.mock("@/hooks/queries/useStockData", () => ({
  useStockData: vi.fn(),
}));

vi.mock("@/lib/toast", () => ({
  appToast: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

function renderForm(overrides = {}) {
  return renderWithClient(
    <StockPreferenceForm
      symbol="MELI"
      isRealtimePaused={false}
      onSubmit={vi.fn()}
      onToggleRealtimePaused={vi.fn()}
      {...overrides}
    />,
  );
}

describe("StockPreferenceForm", () => {
  beforeEach(() => {
    vi.mocked(useStockData).mockReturnValue({
      data: meliStock,
      error: null,
      isError: false,
      isLoading: false,
    } as ReturnType<typeof useStockData>);
  });

  it("shows the selected stock metadata", () => {
    renderForm();

    expect(screen.getByText("MELI - MercadoLibre, Inc. - USD")).toBeTruthy();
  });

  it("submits historical quote params from the form", () => {
    const onSubmit = vi.fn();
    const { container } = renderForm({ onSubmit });

    fireEvent.click(screen.getByText("Histórico"));

    const [startDateInput, endDateInput] = Array.from(
      container.querySelectorAll<HTMLInputElement>(
        'input[type="datetime-local"]',
      ),
    );

    expect(startDateInput.disabled).toBe(false);
    expect(endDateInput.disabled).toBe(false);

    fireEvent.change(startDateInput, {
      target: { value: "2026-05-27T10:00" },
    });
    fireEvent.change(endDateInput, {
      target: { value: "2026-05-28T10:00" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Graficar" }));

    expect(onSubmit).toHaveBeenCalledWith({
      startDate: "2026-05-27T10:00",
      endDate: "2026-05-28T10:00",
      interval: "5min",
      realTime: false,
    });
  });

  it("shows quote errors without leaking technical details", () => {
    renderForm({
      isQuoteError: true,
      quoteError: rawProviderError,
    });

    expect(
      screen.getByText(
        "No pudimos cargar los datos del gráfico. Revisá los filtros e intentá nuevamente.",
      ),
    ).toBeTruthy();
    expect(screen.queryByText("raw provider error")).toBeNull();
  });

  it("calls the realtime pause toggle from the realtime banner", () => {
    const onToggleRealtimePaused = vi.fn();

    renderForm({ onToggleRealtimePaused });

    fireEvent.click(screen.getByRole("button", { name: "Pausar" }));

    expect(onToggleRealtimePaused).toHaveBeenCalledTimes(1);
  });
});
