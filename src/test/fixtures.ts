import type {
  IStock,
  IStockData,
  StockListResponse,
  StockQuoteParams,
  StockSearchResponse,
} from "@/api/types";

export const meliStock: IStock = {
  symbol: "MELI",
  name: "MercadoLibre, Inc.",
  currency: "USD",
  type: "Common Stock",
};

export const appleStock: IStock = {
  symbol: "AAPL",
  name: "Apple Inc.",
  currency: "USD",
  type: "Common Stock",
};

export const microsoftStock: IStock = {
  symbol: "MSFT",
  name: "Microsoft Corporation",
  currency: "USD",
  type: "Common Stock",
};

export const stockList: IStock[] = [appleStock, microsoftStock];

export const stockListResponse: StockListResponse = {
  status: "ok",
  data: [meliStock],
};

export const malformedStockListResponse = {
  status: "ok",
  data: [
    {
      symbol: "MELI",
      name: "MercadoLibre, Inc.",
      type: "Common Stock",
    },
  ],
};

export const appleStockSearchResponse: StockSearchResponse = {
  status: "ok",
  data: [
    {
      symbol: "AAPL",
      instrument_name: "Apple Inc.",
      exchange: "NASDAQ",
      mic_code: "XNAS",
      exchange_timezone: "America/New_York",
      instrument_type: "Common Stock",
      country: "United States",
      currency: "USD",
    },
  ],
};

export const appleStockData: IStockData = {
  status: "ok",
  meta: {
    symbol: "AAPL",
    interval: "5min",
    currency: "USD",
    exchange_timezone: "America/New_York",
    mic_code: "XNAS",
    exchange: "NASDAQ",
    type: "Common Stock",
  },
  values: [
    {
      datetime: "2026-05-28 12:00:00",
      open: "100",
      high: "102",
      low: "99",
      close: "101",
      volume: "1000",
    },
  ],
};

export const malformedStockData = {
  status: "ok",
  meta: appleStockData.meta,
  values: [{ datetime: "2026-05-28 12:00:00", close: 101 }],
};

export const meliStockData: IStockData = {
  ...appleStockData,
  meta: {
    ...appleStockData.meta,
    symbol: "MELI",
  },
};

export const appleQuoteParams: StockQuoteParams = {
  symbol: "AAPL",
  interval: "5min",
  startDate: "2026-05-28",
  endDate: "2026-05-28",
};

export const rawProviderError = new Error("raw provider error");
