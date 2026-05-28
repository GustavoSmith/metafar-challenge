import * as React from "react";
import Highcharts from "highcharts";
import HighchartsBoost from "highcharts/modules/boost";
import HighchartsReactModule from "highcharts-react-official";
import { IStockData, IValuesStockData } from "../types";

const MAX_CHART_POINTS = 1000;

// Vite 8/Rollup envuelve este paquete, por lo que el componente puede estar bajo HighchartsReact.
const HighchartsReact =
  (
    HighchartsReactModule as unknown as {
      HighchartsReact?: typeof HighchartsReactModule;
    }
  ).HighchartsReact ?? HighchartsReactModule;

if (typeof HighchartsBoost === "function") {
  HighchartsBoost(Highcharts);
}

interface IChartProps {
  stockData: IStockData;
}

function sampleStockValues(values: IValuesStockData[]) {
  if (values.length <= MAX_CHART_POINTS) {
    return values;
  }

  const step = Math.ceil(values.length / MAX_CHART_POINTS);

  return values.filter((_, index) => index % step === 0);
}

const ChartScreenComponent: React.FC<IChartProps> = ({ stockData }) => {
  const symbol = stockData.meta.symbol;
  const sampledValues = React.useMemo(
    () => sampleStockValues(stockData.values),
    [stockData.values],
  );

  const chartOptions = React.useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        height: 420,
        style: {
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      title: {
        align: "left",
        text: `${symbol} en el tiempo`,
        style: {
          color: "oklch(0.22 0.02 252)",
          fontSize: "18px",
          fontWeight: "600",
        },
      },
      xAxis: {
        categories: sampledValues.map(
          (item: IValuesStockData) => item.datetime,
        ),
        title: {
          text: null,
        },
        labels: {
          style: {
            color: "oklch(0.48 0.018 252)",
          },
        },
      },
      yAxis: {
        gridLineColor: "oklch(0.88 0.012 250)",
        title: {
          text: "Precio de cierre",
          style: {
            color: "oklch(0.48 0.018 252)",
          },
        },
        labels: {
          style: {
            color: "oklch(0.48 0.018 252)",
          },
        },
      },
      tooltip: {
        borderColor: "oklch(0.88 0.012 250)",
        borderRadius: 12,
        shared: true,
        valueDecimals: 2,
      },
      plotOptions: {
        series: {
          color: "oklch(0.54 0.13 245)",
          lineWidth: 2,
          marker: {
            enabled: false,
          },
        },
      },
      boost: {
        enabled: stockData.values.length > MAX_CHART_POINTS,
        useGPUTranslations: true,
      },
      series: [
        {
          boostThreshold: MAX_CHART_POINTS,
          name: "Precio de cierre",
          data: sampledValues.map((item: IValuesStockData) =>
            parseFloat(item.close),
          ),
        },
      ],
    }),
    [sampledValues, stockData.values.length, symbol],
  );

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

const ChartScreen = React.memo(ChartScreenComponent);

export default ChartScreen;
