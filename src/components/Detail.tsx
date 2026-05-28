import * as React from "react";
import { StockPreferenceForm, Chart } from "./index";
import { useParams } from "react-router-dom";
import { useStockQuote } from "@/hooks/queries/useStockQuote";
import type { StockPreferenceFormValues } from "../types";

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
    <>
      <StockPreferenceForm
        symbol={selectedSymbol}
        isQuoteError={isQuoteError}
        isQuoteFetching={isQuoteFetching}
        isQuoteLoading={isQuoteLoading}
        onSubmit={setQuoteParams}
        quoteError={quoteError}
      />
      {stockData && <Chart stockData={stockData} />}
    </>
  );
};

export default Detail;
