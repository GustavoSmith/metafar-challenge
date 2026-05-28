import { isRecord } from "./client";
import type {
  IMetaStockData,
  IStock,
  IStockData,
  IValuesStockData,
  StockListResponse,
  StockSearchResponse,
  StockSearchResult,
} from "./types";

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || isString(value);
}

function isSuccessStatus(value: unknown): value is "ok" {
  return value === "ok";
}

export function isStock(value: unknown): value is IStock {
  return (
    isRecord(value) &&
    isString(value.symbol) &&
    isString(value.name) &&
    isString(value.currency) &&
    isString(value.type) &&
    isOptionalString(value.exchange) &&
    isOptionalString(value.mic_code) &&
    isOptionalString(value.country)
  );
}

export function isStockListResponse(
  value: unknown,
): value is StockListResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.data) &&
    value.data.every(isStock) &&
    isSuccessStatus(value.status)
  );
}

function isStockSearchResult(value: unknown): value is StockSearchResult {
  return (
    isRecord(value) &&
    isString(value.symbol) &&
    isString(value.instrument_name) &&
    isString(value.exchange) &&
    isString(value.mic_code) &&
    isString(value.exchange_timezone) &&
    isString(value.instrument_type) &&
    isString(value.country) &&
    isString(value.currency)
  );
}

export function isStockSearchResponse(
  value: unknown,
): value is StockSearchResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.data) &&
    value.data.every(isStockSearchResult) &&
    isSuccessStatus(value.status)
  );
}

function isMetaStockData(value: unknown): value is IMetaStockData {
  return (
    isRecord(value) &&
    isString(value.symbol) &&
    isString(value.interval) &&
    isString(value.currency) &&
    isString(value.exchange_timezone) &&
    isString(value.mic_code) &&
    isString(value.exchange) &&
    isString(value.type)
  );
}

function isValuesStockData(value: unknown): value is IValuesStockData {
  return (
    isRecord(value) &&
    isString(value.datetime) &&
    isString(value.open) &&
    isString(value.high) &&
    isString(value.low) &&
    isString(value.close) &&
    isString(value.volume)
  );
}

export function isStockData(value: unknown): value is IStockData {
  return (
    isRecord(value) &&
    isMetaStockData(value.meta) &&
    Array.isArray(value.values) &&
    value.values.every(isValuesStockData) &&
    isSuccessStatus(value.status)
  );
}

