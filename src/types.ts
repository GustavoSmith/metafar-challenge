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
  name: string;
  value: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

export interface IDateInputProps {
  disabled: boolean;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}

export interface ISelectInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: IOption[];
}

export interface IButtonProps {
  type: "submit" | "button" | "reset";
  variant: "contained" | "outlined" | "text";
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export interface IntervalSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  style?: React.CSSProperties;
}

export interface IStockPreferenceFormProps {
  symbol: string;
  handleSetStockData: React.Dispatch<React.SetStateAction<IStockData | null>>;
}
