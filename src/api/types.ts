export interface TwelveDataErrorResponse {
  code: number;
  message: string;
  status: "error";
}

export interface IStock {
  symbol: string;
  name: string;
  currency: string;
  type: string;
  exchange?: string;
  mic_code?: string;
  country?: string;
}

export interface StockListParams {
  exchange?: string;
  source?: string;
}

export interface StockDataParams {
  symbol: string;
  source?: string;
}

export interface StockListResponse {
  data: IStock[];
  status: string;
}

export interface StockSearchParams {
  query: string;
}

export interface StockSearchResult {
  symbol: string;
  instrument_name: string;
  exchange: string;
  mic_code: string;
  exchange_timezone: string;
  instrument_type: string;
  country: string;
  currency: string;
}

export interface StockSearchResponse {
  data: StockSearchResult[];
  status: string;
}

export interface IMetaStockData {
  symbol: string;
  interval: string;
  currency: string;
  exchange_timezone: string;
  mic_code: string;
  exchange: string;
  type: string;
}

export interface IValuesStockData {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export interface IStockData {
  meta: IMetaStockData;
  values: IValuesStockData[];
  status: string;
}

export interface StockQuoteParams {
  symbol: string;
  interval: string;
  startDate?: string;
  endDate?: string;
}
