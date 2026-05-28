import type { StockQuoteParams } from "./api/types";

export type {
  IMetaStockData,
  IStock,
  IStockData,
  IValuesStockData,
  StockQuoteParams,
  StockSearchResult,
} from "./api/types";

interface IOption {
  value: string;
  label: string;
}

export interface IRadioButtonProps {
  value: string;
  label: string;
}

export interface IDateInputProps {
  disabled: boolean;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export interface ISelectInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: IOption[];
  className?: string;
}

export interface IButtonProps {
  type: "submit" | "button" | "reset";
  variant: "contained" | "outlined" | "text";
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface IntervalSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export interface StockPreferenceFormValues extends Omit<
  StockQuoteParams,
  "symbol"
> {
  realTime: boolean;
}

export interface IStockPreferenceFormProps {
  symbol: string;
  isQuoteError?: boolean;
  isQuoteFetching?: boolean;
  isQuoteLoading?: boolean;
  onSubmit: (values: StockPreferenceFormValues) => void;
  quoteError?: unknown;
}
