import React from "react";
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

  function handleIntervalChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setInterval(event.target.value);
  }

  function handleStartDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setStartDate(event.target.value);
  }

  function handleEndDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEndDate(event.target.value);
  }

  function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    // If the user selects "realtime", set the start and end date to the current day
    if (event.target.value === "realtime") {
      const date = getCurrentDay();
      setStartDate(date);
      setEndDate(date);
    }
    setRealTime(event.target.value === "realtime");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        borderBottom: "1px solid #ccc",
        padding: "10px",
        marginBottom: "20px",
      }}
    >
      <div style={styles.headerContainer}>
        <div style={styles.headerTitle}>
          {symbol} - {detailStock?.name} - {detailStock?.currency}
        </div>
        <div
          style={{
            marginTop: "10px",
            fontSize: "18px",
            textAlign: "right",
          }}
        >
          Usuario: Juan
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={styles.radioContainer}>
          <RadioButton
            name="dataOption"
            value="realtime"
            checked={realTime}
            onChange={handleCheckboxChange}
            label="Tiempo Real"
          />
          <span style={styles.description}>
            (utiliza la fecha actual, al graficar esta opción, se debe
            actualizar el gráfico en forma automática según el intervalo
            seleccionado)
          </span>
        </div>
        <div style={styles.radioContainer}>
          <RadioButton
            name="dataOption"
            value="history"
            checked={!realTime}
            onChange={handleCheckboxChange}
            label="Histórico"
          />
          <div style={styles.dateInputContainer}>
            <DateInput
              disabled={realTime}
              value={startDate}
              onChange={handleStartDateChange}
              style={styles.dateInput}
            />
            <DateInput
              disabled={realTime}
              value={endDate}
              onChange={handleEndDateChange}
              style={styles.dateInput}
            />
          </div>
        </div>
        <IntervalSelect
          value={interval}
          onChange={handleIntervalChange}
          style={styles.intervalSelect}
        />
        <Button variant="contained" type="submit" style={styles.button}>
          Graficar
        </Button>
      </div>
    </form>
  );
};

const styles = {
  form: {},
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: "24px",
    marginBottom: "10px",
  },
  headerOptions: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginRight: "20px",
    marginBottom: "10px",
  },
  description: {
    fontSize: "12px",
    color: "#666",
    marginLeft: "5px",
  },
  radioContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  dateInputContainer: {
    margin: "0px 5px",
  },
  dateInput: {
    padding: "5px",
    fontSize: "14px",
    margin: "10px 0px",
  },
  intervalSelect: {
    padding: "5px",
    fontSize: "17px",
    marginBottom: "10px",
  },
  button: {
    padding: "5px 10px",
    fontSize: "14px",
    cursor: "pointer",
  },
  headerUser: {
    marginTop: "10px",
    fontSize: "18px",
    textAlign: "right",
  },
};

export default StockPreferenceForm;
