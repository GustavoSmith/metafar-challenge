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

export interface IStock {
  symbol: string;
  name: string;
  currency: string;
  type: string;
}
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
}

export interface IntervalSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export interface IStockPreferenceFormProps {
  symbol: string;
  handleSetStockData: React.Dispatch<React.SetStateAction<IStockData | null>>;
}
