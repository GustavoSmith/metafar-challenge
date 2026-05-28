import * as React from "react";
import { Input } from "@base-ui/react/input";
import { IDateInputProps } from "../../types";
import { cn } from "@/lib/utils";

const DateInput: React.FC<IDateInputProps> = ({
  disabled,
  value,
  onChange,
  className,
}) => (
  <Input
    type="datetime-local"
    disabled={disabled}
    value={value}
    onChange={onChange}
    className={cn(
      "my-2.5 rounded border border-gray-300 px-1.5 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
  />
);

export default DateInput;
