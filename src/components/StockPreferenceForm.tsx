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
      className="mb-5 flex flex-col border-b border-gray-300 p-2.5"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <div className="mb-2.5 text-2xl">
          {symbol}
          {isStockLoading && " - Cargando..."}
          {detailStock && ` - ${detailStock.name} - ${detailStock.currency}`}
        </div>
        <div className="mt-2.5 text-right text-lg">Usuario: Juan</div>
      </div>
      {isStockError && (
        <p className="mb-3 text-sm text-red-600">{stockErrorMessage}</p>
      )}
      {isQuoteFetching && !isQuoteLoading && (
        <p className="mb-3 text-sm text-gray-500">
          Actualizando serie de precios...
        </p>
      )}
      {isQuoteError && (
        <p className="mb-3 text-sm text-red-600">{quoteErrorMessage}</p>
      )}
      <div className="flex flex-col">
        <RadioGroup
          value={realTime ? "realtime" : "history"}
          onValueChange={handleDataOptionChange}
          className="flex flex-col"
        >
          <div className="mb-2.5 flex items-center">
            <RadioButton value="realtime" label="Tiempo Real" />
            <span className="ml-1 text-xs text-gray-600">
              (utiliza la fecha actual, al graficar esta opción, se debe
              actualizar el gráfico en forma automática según el intervalo
              seleccionado)
            </span>
          </div>
          <div className="mb-2.5 flex items-center">
            <RadioButton value="history" label="Histórico" />
            <div className="mx-1">
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
          <div className="mb-3 flex flex-col gap-2 rounded border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {realtimeStatus}. El gráfico se refresca según el intervalo
              seleccionado.
            </span>
            <button
              type="button"
              onClick={onToggleRealtimePaused}
              className="self-start rounded border border-blue-300 px-3 py-1 font-medium hover:bg-blue-100 sm:self-auto"
            >
              {isRealtimePaused ? "Reanudar" : "Pausar"}
            </button>
          </div>
        )}
        <IntervalSelect value={interval} onChange={handleIntervalChange} />
        <Button
          variant="contained"
          type="submit"
          className="self-start"
          disabled={isQuoteLoading}
        >
          {isQuoteLoading ? "Cargando..." : "Graficar"}
        </Button>
      </div>
    </form>
  );
};

export default StockPreferenceForm;
