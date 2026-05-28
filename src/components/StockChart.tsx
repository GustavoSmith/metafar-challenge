import * as React from "react";
import Highcharts from "highcharts";
import HighchartsBoost from "highcharts/modules/boost";
import HighchartsReact from "highcharts-react-official";
import { IStockData, IValuesStockData } from "../types";

const MAX_CHART_POINTS = 1000;

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
      title: {
        text: symbol,
      },
      xAxis: {
        categories: sampledValues.map(
          (item: IValuesStockData) => item.datetime,
        ),
        title: {
          text: "Interval",
        },
      },
      yAxis: {
        title: {
          text: "Price",
        },
      },
      boost: {
        enabled: stockData.values.length > MAX_CHART_POINTS,
        useGPUTranslations: true,
      },
      series: [
        {
          boostThreshold: MAX_CHART_POINTS,
          name: "Interval",
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
