import * as React from "react";
import { Input } from "@base-ui/react/input";
import { IDateInputProps } from "../../types";
import { cn } from "@/lib/utils";

const DateInput: React.FC<IDateInputProps> = ({
  disabled,
  value,
  onChange,
  className,
  label,
}) => (
  <Input
    type="datetime-local"
    aria-label={label}
    disabled={disabled}
    value={value}
    onChange={onChange}
    className={cn(
      "border-border bg-surface text-foreground focus:border-accent focus:ring-accent/15 disabled:bg-surface-muted disabled:text-muted-foreground h-10 rounded-xl border px-3 text-sm shadow-sm focus:ring-2 focus:outline-none disabled:cursor-not-allowed",
      className,
    )}
  />
);

export default DateInput;
