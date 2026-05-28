import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { IStockData, IValuesStockData } from "../types";

const MAX_CHART_POINTS = 1000;

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
      series: [
        {
          name: "Interval",
          data: sampledValues.map((item: IValuesStockData) =>
            parseFloat(item.close),
          ),
        },
      ],
    }),
    [sampledValues, symbol],
  );

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

const ChartScreen = React.memo(ChartScreenComponent);

export default ChartScreen;
