import * as React from "react";
import StockPreferenceForm from "./StockPreferenceForm";
import { useNavigate, useParams } from "react-router-dom";
import { useStockQuote } from "@/hooks/queries/useStockQuote";
import { appToast } from "@/lib/toast";
import type { StockPreferenceFormValues } from "../types";

const Chart = React.lazy(() => import("./StockChart"));
const DEFAULT_SYMBOL = "MELI";
const DEFAULT_INTERVAL = "5min";

function createDefaultQuoteParams(): StockPreferenceFormValues {
  return {
    endDate: "",
    interval: DEFAULT_INTERVAL,
    realTime: true,
    startDate: "",
  };
}

const Detail: React.FC = () => {
  const navigate = useNavigate();
  const { symbol } = useParams<{ symbol?: string }>();
  const selectedSymbol = symbol || DEFAULT_SYMBOL;
  const [quoteParams, setQuoteParams] =
    React.useState<StockPreferenceFormValues>(() => createDefaultQuoteParams());
  const [isRealtimePaused, setIsRealtimePaused] = React.useState(false);
  const quoteQueryParams = {
    ...quoteParams,
    realTime: quoteParams.realTime && !isRealtimePaused,
    symbol: selectedSymbol,
  };
  const {
    data: stockData,
    error: quoteError,
    isError: isQuoteError,
    isFetching: isQuoteFetching,
    isLoading: isQuoteLoading,
  } = useStockQuote(quoteQueryParams);

  React.useEffect(() => {
    if (isQuoteError) {
      appToast.error({
        id: `quote-error-${selectedSymbol}`,
        title: "No pudimos actualizar el gráfico",
        description:
          quoteError instanceof Error
            ? quoteError.message
            : "Revisá los parámetros y volvé a intentar.",
      });
    }
  }, [isQuoteError, quoteError, selectedSymbol]);

  function handleSubmit(values: StockPreferenceFormValues) {
    setQuoteParams(values);
    setIsRealtimePaused(false);
    appToast.info({
      id: `quote-submit-${selectedSymbol}`,
      title: "Actualizando gráfico",
      description: values.realTime
        ? "Modo tiempo real activo con actualización automática."
        : "Consultando datos históricos con el rango seleccionado.",
    });
  }

  function handleToggleRealtimePaused() {
    setIsRealtimePaused((currentValue) => {
      const nextValue = !currentValue;

      appToast.info({
        id: `realtime-status-${selectedSymbol}`,
        title: nextValue
          ? "Actualizaciones pausadas"
          : "Actualizaciones reanudadas",
        description: nextValue
          ? "El gráfico mantiene los datos actuales hasta que reanudes."
          : "El gráfico vuelve a refrescarse según el intervalo seleccionado.",
      });

      return nextValue;
    });
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-2 rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        <span aria-hidden="true">←</span>
        Volver
      </button>
      <StockPreferenceForm
        symbol={selectedSymbol}
        isQuoteError={isQuoteError}
        isQuoteFetching={isQuoteFetching}
        isQuoteLoading={isQuoteLoading}
        isRealtimePaused={isRealtimePaused}
        onSubmit={handleSubmit}
        onToggleRealtimePaused={handleToggleRealtimePaused}
        quoteError={quoteError}
      />
      {isQuoteLoading && !stockData && (
        <div className="rounded border p-6">
          <div className="mb-4 h-6 w-40 animate-pulse rounded bg-gray-200" />
          <div className="h-72 animate-pulse rounded bg-gray-100" />
        </div>
      )}
      {stockData && (
        <React.Suspense
          fallback={<div className="py-8 text-center">Cargando gráfico...</div>}
        >
          <Chart stockData={stockData} />
        </React.Suspense>
      )}
    </div>
  );
};

export default Detail;
