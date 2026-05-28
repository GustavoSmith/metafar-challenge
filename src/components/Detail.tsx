import * as React from "react";
import StockPreferenceForm from "./StockPreferenceForm";
import { useNavigate, useParams } from "react-router-dom";
import { useStockQuote } from "@/hooks/queries/useStockQuote";
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
  const quoteQueryParams = {
    ...quoteParams,
    symbol: selectedSymbol,
  };
  const {
    data: stockData,
    error: quoteError,
    isError: isQuoteError,
    isFetching: isQuoteFetching,
    isLoading: isQuoteLoading,
  } = useStockQuote(quoteQueryParams);

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
        onSubmit={setQuoteParams}
        quoteError={quoteError}
      />
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
