import {
  getTwelveDataApiKey,
  parseTwelveDataResponse,
  twelveDataClient,
} from "./client";
import { userErrorMessages } from "@/lib/userMessages";
import { twelveDataEndpoints } from "./endpoints";
import { isStockListResponse, isStockSearchResponse } from "./guards";
import {
  IStock,
  StockDataParams,
  StockListParams,
  StockSearchParams,
  StockSearchResult,
} from "./types";

const DEFAULT_STOCK_LIST_PARAMS = {
  exchange: "NASDAQ",
  source: "docs",
} satisfies StockListParams;

export async function getStockList(
  params: StockListParams = DEFAULT_STOCK_LIST_PARAMS,
  signal?: AbortSignal,
): Promise<IStock[]> {
  const response = await twelveDataClient.get<unknown>(
    twelveDataEndpoints.stocks,
    {
      params,
      signal,
    },
  );

  const stockList = parseTwelveDataResponse(
    response.data,
    isStockListResponse,
    userErrorMessages.stockList,
  );

  return stockList.data;
}

export async function getStockData(
  symbol: string,
  signal?: AbortSignal,
): Promise<IStock | null> {
  const params = {
    symbol,
    source: "docs",
  } satisfies StockDataParams;

  const response = await twelveDataClient.get<unknown>(
    twelveDataEndpoints.stocks,
    {
      params,
      signal,
    },
  );

  const stockList = parseTwelveDataResponse(
    response.data,
    isStockListResponse,
    userErrorMessages.stockData,
  );

  return stockList.data[0] ?? null;
}

export async function searchStocks(
  { query }: StockSearchParams,
  signal?: AbortSignal,
): Promise<StockSearchResult[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const response = await twelveDataClient.get<unknown>(
    twelveDataEndpoints.symbolSearch,
    {
      params: {
        symbol: normalizedQuery,
        apikey: getTwelveDataApiKey(),
      },
      signal,
    },
  );

  const searchResponse = parseTwelveDataResponse(
    response.data,
    isStockSearchResponse,
    userErrorMessages.stockSearch,
  );

  return searchResponse.data;
}
