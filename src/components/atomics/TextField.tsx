import * as React from "react";
import { Field } from "@base-ui/react/field";
import { Input } from "@base-ui/react/input";
import { cn } from "@/lib/utils";

interface ISearchFieldProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchField: React.FC<ISearchFieldProps> = ({
  label,
  value,
  onChange,
}) => (
  <Field.Root className="mr-2 mb-2 inline-block min-w-[200px]">
    <Field.Label className="mb-1 block text-sm font-medium">
      {label}
    </Field.Label>
    <Input
      value={value}
      onChange={onChange}
      className={cn(
        "w-full rounded-md border border-gray-300 px-3 py-2 text-sm",
        "focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none",
      )}
    />
  </Field.Root>
);

export default SearchField;
