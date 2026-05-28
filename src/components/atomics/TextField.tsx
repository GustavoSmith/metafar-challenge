import * as React from "react";
import { Field } from "@base-ui/react/field";
import { Input } from "@base-ui/react/input";
import { cn } from "@/lib/utils";

interface ISearchFieldProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const SearchField: React.FC<ISearchFieldProps> = ({
  label,
  value,
  onChange,
  className,
}) => (
  <Field.Root className={cn("min-w-0", className)}>
    <Field.Label className="text-foreground mb-1.5 block text-sm font-semibold">
      {label}
    </Field.Label>
    <Input
      value={value}
      onChange={onChange}
      className={cn(
        "border-border bg-surface text-foreground h-10 w-full rounded-xl border px-3 text-sm shadow-sm",
        "placeholder:text-muted-foreground focus:border-accent focus:ring-accent/15 focus:ring-2 focus:outline-none",
      )}
    />
  </Field.Root>
);

export default SearchField;
