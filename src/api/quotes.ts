import {
  getTwelveDataApiKey,
  parseTwelveDataResponse,
  twelveDataClient,
} from "./client";
import { userErrorMessages } from "@/lib/userMessages";
import { twelveDataEndpoints } from "./endpoints";
import { isStockData } from "./guards";
import { IStockData, StockQuoteParams } from "./types";

export async function getStockQuote(
  { symbol, interval, startDate, endDate }: StockQuoteParams,
  signal?: AbortSignal,
): Promise<IStockData> {
  const response = await twelveDataClient.get<unknown>(
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

  return parseTwelveDataResponse(
    response.data,
    isStockData,
    userErrorMessages.stockQuote,
  );
}
