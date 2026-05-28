import {
  assertSuccessfulResponse,
  getTwelveDataApiKey,
  twelveDataClient,
} from "./client";
import { twelveDataEndpoints } from "./endpoints";
import { IStockData, StockQuoteParams } from "./types";

export async function getStockQuote(
  { symbol, interval, startDate, endDate }: StockQuoteParams,
  signal?: AbortSignal,
) {
  const response = await twelveDataClient.get<IStockData>(
    twelveDataEndpoints.timeSeries,
    {
      params: {
        symbol,
        interval,
        apikey: getTwelveDataApiKey(),
        ...(startDate && endDate
          ? { start_date: startDate, end_date: endDate }
          : {}),
      },
      signal,
    },
  );

  assertSuccessfulResponse(response.data);

  return response.data;
}
