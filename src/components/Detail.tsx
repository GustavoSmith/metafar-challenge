import * as React from "react";
import StockPreferenceForm from "./StockPreferenceForm";
import { useNavigate, useParams } from "react-router-dom";
import { useStockQuote } from "@/hooks/queries/useStockQuote";
import { appToast } from "@/lib/toast";
import { getUserFriendlyMessage } from "@/lib/userMessages";
import type { StockPreferenceFormValues } from "../types";
import { Button } from "./atomics/index";

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
        description: getUserFriendlyMessage(quoteError, "stockQuote"),
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
    <main className="bg-background text-foreground min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Button
          variant="outlined"
          type="button"
          onClick={() => navigate("/")}
          className="mb-4 gap-2"
        >
          <span aria-hidden="true">←</span>
          Volver
        </Button>
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
          <section className="border-border bg-surface rounded-3xl border p-4 shadow-sm sm:p-6">
            <div className="bg-muted mb-4 h-6 w-40 animate-pulse rounded" />
            <div className="bg-surface-muted h-72 animate-pulse rounded-2xl" />
          </section>
        )}
        {stockData && (
          <section className="border-border bg-surface rounded-3xl border p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Evolución del precio</h2>
                <p className="text-muted-foreground text-sm">
                  Serie basada en el cierre de cada intervalo.
                </p>
              </div>
            </div>
            <React.Suspense
              fallback={
                <div className="text-muted-foreground py-8 text-center text-sm">
                  Cargando gráfico...
                </div>
              }
            >
              <Chart stockData={stockData} />
            </React.Suspense>
          </section>
        )}
      </div>
    </main>
  );
};

export default Detail;
