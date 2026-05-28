import React from "react";
import { RadioGroup } from "@base-ui/react/radio-group";
import { getStockData, getStockQuote } from "../api";
import {
  RadioButton,
  DateInput,
  IntervalSelect,
  Button,
} from "./atomics/index";
import { IStock, IStockPreferenceFormProps } from "../types";
import { getCurrentDay } from "../helpers";

const StockPreferenceForm: React.FC<IStockPreferenceFormProps> = ({
  handleSetStockData,
  symbol,
}) => {
  const [interval, setInterval] = React.useState<string>("5min");
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");
  const [realTime, setRealTime] = React.useState<boolean>(true);
  const [detailStock, setDetailStock] = React.useState<IStock | null>(null);

  React.useEffect(() => {
    async function fetchDefaultData() {
      try {
        const data = await getStockQuote(symbol, interval, startDate, endDate);
        handleSetStockData(data);
      } catch (error) {
        console.error("Error fetching default stock data:", error);
      }

      try {
        const { data } = await getStockData(symbol);
        setDetailStock(data[0]);
      } catch (error) {
        console.error("Error fetching stock:", error);
      }
    }

    fetchDefaultData();
  }, [symbol]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const data = await getStockQuote(symbol, interval, startDate, endDate);
      handleSetStockData(data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  }

  function handleIntervalChange(value: string) {
    setInterval(value);
  }

  function handleStartDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setStartDate(event.target.value);
  }

  function handleEndDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEndDate(event.target.value);
  }

  function handleDataOptionChange(value: string) {
    if (value === "realtime") {
      const date = getCurrentDay();
      setStartDate(date);
      setEndDate(date);
    }
    setRealTime(value === "realtime");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-5 flex flex-col border-b border-gray-300 p-2.5"
    >
      <div className="flex justify-between">
        <div className="mb-2.5 text-2xl">
          {symbol} - {detailStock?.name} - {detailStock?.currency}
        </div>
        <div className="mt-2.5 text-right text-lg">Usuario: Juan</div>
      </div>
      <div className="flex flex-col">
        <RadioGroup
          value={realTime ? "realtime" : "history"}
          onValueChange={handleDataOptionChange}
          className="flex flex-col"
        >
          <div className="mb-2.5 flex items-center">
            <RadioButton value="realtime" label="Tiempo Real" />
            <span className="ml-1 text-xs text-gray-600">
              (utiliza la fecha actual, al graficar esta opción, se debe
              actualizar el gráfico en forma automática según el intervalo
              seleccionado)
            </span>
          </div>
          <div className="mb-2.5 flex items-center">
            <RadioButton value="history" label="Histórico" />
            <div className="mx-1">
              <DateInput
                disabled={realTime}
                value={startDate}
                onChange={handleStartDateChange}
              />
              <DateInput
                disabled={realTime}
                value={endDate}
                onChange={handleEndDateChange}
              />
            </div>
          </div>
        </RadioGroup>
        <IntervalSelect value={interval} onChange={handleIntervalChange} />
        <Button variant="contained" type="submit" className="self-start">
          Graficar
        </Button>
      </div>
    </form>
  );
};

export default StockPreferenceForm;
