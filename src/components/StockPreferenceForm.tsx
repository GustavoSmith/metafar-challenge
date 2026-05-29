import React from "react";
import { RadioGroup } from "@base-ui/react/radio-group";
import {
  RadioButton,
  DateInput,
  IntervalSelect,
  Button,
} from "./atomics/index";
import { useStockData } from "@/hooks/queries/useStockData";
import type { IStockPreferenceFormProps } from "../types";
import { getCurrentDay } from "../helpers";
import { appToast } from "@/lib/toast";
import { getUserFriendlyMessage } from "@/lib/userMessages";

const DEFAULT_INTERVAL = "5min";

const StockPreferenceForm: React.FC<IStockPreferenceFormProps> = ({
  isQuoteError = false,
  isQuoteFetching = false,
  isQuoteLoading = false,
  isRealtimePaused,
  onToggleRealtimePaused,
  onSubmit,
  quoteError,
  symbol,
}) => {
  const [interval, setInterval] = React.useState<string>(DEFAULT_INTERVAL);
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");
  const [realTime, setRealTime] = React.useState<boolean>(true);

  const {
    data: detailStock,
    error: stockError,
    isError: isStockError,
    isLoading: isStockLoading,
  } = useStockData(symbol);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      endDate,
      interval,
      realTime,
      startDate,
    });
  }

  function handleIntervalChange(value: string) {
    setInterval(value);
  }

  function handleStartDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setStartDate(event.target.value);
  }

  function handleEndDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEndDate(event.target.value);
  }

  function handleDataOptionChange(value: string) {
    if (value === "realtime") {
      const date = getCurrentDay();
      setStartDate(date);
      setEndDate(date);
    }
    setRealTime(value === "realtime");
  }

  const stockErrorMessage = getUserFriendlyMessage(stockError, "stockData");
  const quoteErrorMessage = getUserFriendlyMessage(quoteError, "stockQuote");
  const realtimeStatus = isRealtimePaused
    ? "Tiempo real pausado"
    : "Tiempo real activo";

  React.useEffect(() => {
    if (isStockError) {
      appToast.error({
        id: `stock-data-error-${symbol}`,
        title: "No pudimos cargar la acción",
        description: stockErrorMessage,
      });
    }
  }, [isStockError, stockErrorMessage, symbol]);

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border bg-surface mb-5 rounded-3xl border p-4 shadow-sm sm:p-6"
    >
      <div className="border-border mb-5 flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-accent text-xs font-semibold tracking-[0.18em] uppercase">
            Detalle de acción
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            {symbol}
            {isStockLoading && " - Cargando..."}
            {detailStock && ` - ${detailStock.name} - ${detailStock.currency}`}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
            Elegí si querés seguir el precio en tiempo real o consultar un rango
            histórico.
          </p>
        </div>
        <div className="bg-surface-muted text-muted-foreground self-start rounded-2xl px-4 py-2 text-sm font-medium">
          {/* TODO: Agregar el nombre del usuario real */}
          Usuario: Juan
        </div>
      </div>
      {isStockError && (
        <p className="bg-danger-muted text-danger mb-4 rounded-2xl px-4 py-3 text-sm">
          {stockErrorMessage}
        </p>
      )}
      {isQuoteFetching && !isQuoteLoading && (
        <p className="bg-accent-muted text-accent mb-4 rounded-2xl px-4 py-3 text-sm font-medium">
          Actualizando serie de precios...
        </p>
      )}
      {isQuoteError && (
        <p className="bg-danger-muted text-danger mb-4 rounded-2xl px-4 py-3 text-sm">
          {quoteErrorMessage}
        </p>
      )}
      <div className="space-y-5">
        <RadioGroup
          value={realTime ? "realtime" : "history"}
          onValueChange={handleDataOptionChange}
          className="grid gap-3"
        >
          <div className="border-border bg-background rounded-2xl border p-4">
            <RadioButton value="realtime" label="Tiempo Real" />
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              Usa la fecha actual y refresca el gráfico según el intervalo.
            </p>
          </div>
          <div className="border-border bg-background rounded-2xl border p-4">
            <RadioButton value="history" label="Histórico" />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <DateInput
                disabled={realTime}
                value={startDate}
                onChange={handleStartDateChange}
              />
              <DateInput
                disabled={realTime}
                value={endDate}
                onChange={handleEndDateChange}
              />
            </div>
          </div>
        </RadioGroup>
        {realTime && (
          <div className="bg-accent-muted text-accent flex flex-col gap-3 rounded-2xl p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span>
              {realtimeStatus}. El gráfico se refresca según el intervalo
              seleccionado.
            </span>
            <Button
              variant="outlined"
              type="button"
              onClick={onToggleRealtimePaused}
              className="border-accent/25 self-start sm:self-auto"
            >
              {isRealtimePaused ? "Reanudar" : "Pausar"}
            </Button>
          </div>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <IntervalSelect value={interval} onChange={handleIntervalChange} />
          <Button
            variant="contained"
            type="submit"
            className="w-full sm:w-auto"
            disabled={isQuoteLoading}
          >
            {isQuoteLoading ? "Cargando..." : "Graficar"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default StockPreferenceForm;
