import * as React from "react";
import SelectInput from "./SelectInput";
import { IntervalSelectProps } from "../../types";
import { cn } from "@/lib/utils";

const IntervalSelect: React.FC<IntervalSelectProps> = ({
  value,
  onChange,
  className,
}) => {
  const options = [
    { value: "1min", label: "1 minuto" },
    { value: "5min", label: "5 minutos" },
    { value: "15min", label: "15 minutos" },
  ];

  return (
    <div className={cn("mb-2.5", className)}>
      <SelectInput
        label="Intervalo:"
        value={value}
        onChange={onChange}
        options={options}
      />
    </div>
  );
};

export default IntervalSelect;
