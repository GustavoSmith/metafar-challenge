import {
  assertSuccessfulResponse,
  getTwelveDataApiKey,
  twelveDataClient,
} from "./client";
import { twelveDataEndpoints } from "./endpoints";
import {
  IStock,
  StockDataParams,
  StockListParams,
  StockListResponse,
  StockSearchParams,
  StockSearchResponse,
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
  const response = await twelveDataClient.get<StockListResponse>(
    twelveDataEndpoints.stocks,
    {
      params,
      signal,
    },
  );

  assertSuccessfulResponse(response.data);

  return response.data.data;
}

export async function getStockData(
  symbol: string,
  signal?: AbortSignal,
): Promise<IStock | null> {
  const params = {
    symbol,
    source: "docs",
  } satisfies StockDataParams;

  const response = await twelveDataClient.get<StockListResponse>(
    twelveDataEndpoints.stocks,
    {
      params,
      signal,
    },
  );

  assertSuccessfulResponse(response.data);

  return response.data.data[0] ?? null;
}

export async function searchStocks(
  { query }: StockSearchParams,
  signal?: AbortSignal,
): Promise<StockSearchResult[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const response = await twelveDataClient.get<StockSearchResponse>(
    twelveDataEndpoints.symbolSearch,
    {
      params: {
        symbol: normalizedQuery,
        apikey: getTwelveDataApiKey(),
      },
      signal,
    },
  );

  assertSuccessfulResponse(response.data);

  return response.data.data;
}
