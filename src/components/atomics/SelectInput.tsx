import * as React from "react";
import { Select } from "@base-ui/react/select";
import { ISelectInputProps } from "../../types";
import { cn } from "@/lib/utils";

const SelectInput: React.FC<ISelectInputProps> = ({
  value,
  onChange,
  options,
  className,
}) => (
  <Select.Root
    items={options}
    value={value}
    onValueChange={(nextValue) => {
      if (nextValue !== null) {
        onChange(nextValue);
      }
    }}
  >
    <Select.Trigger
      className={cn(
        "flex h-8 w-48 items-center justify-between gap-3 rounded border border-gray-300 bg-white px-2 text-sm leading-none",
        "hover:bg-gray-50 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-gray-900",
        className,
      )}
    >
      <Select.Value />
      <Select.Icon>
        <CaretUpDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner className="z-10 outline-hidden" sideOffset={4}>
        <Select.Popup className="min-w-[var(--anchor-width)] rounded border border-gray-300 bg-white py-1 text-sm shadow-md outline-hidden">
          <Select.List className="max-h-[var(--available-height)] overflow-y-auto">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 px-2 py-1.5 outline-hidden select-none data-highlighted:bg-gray-900 data-highlighted:text-white"
              >
                <Select.ItemIndicator className="col-start-1">
                  <CheckIcon />
                </Select.ItemIndicator>
                <Select.ItemText className="col-start-2">
                  {option.label}
                </Select.ItemText>
              </Select.Item>
            ))}
          </Select.List>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
);

function CaretUpDownIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M11 10H5l3 3.5zm0-4H5l3-3.5z" />
    </svg>
  );
}

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
    </svg>
  );
}

export default SelectInput;
