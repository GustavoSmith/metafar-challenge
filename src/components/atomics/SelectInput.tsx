import * as React from "react";
import { Select } from "@base-ui/react/select";
import { ISelectInputProps } from "../../types";
import { cn } from "@/lib/utils";

const SelectInput: React.FC<ISelectInputProps> = ({
  value,
  onChange,
  options,
  className,
  label,
}) => (
  <div className="space-y-1.5">
    {label && (
      <div className="text-foreground text-sm font-semibold">{label}</div>
    )}
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
          "border-border bg-surface text-foreground flex h-10 w-full items-center justify-between gap-3 rounded-xl border px-3 text-sm leading-none shadow-sm",
          "hover:bg-surface-muted focus-visible:outline-accent focus-visible:outline-2 focus-visible:-outline-offset-1",
          className,
        )}
        aria-label={label}
      >
        <Select.Value />
        <Select.Icon className="text-muted-foreground">
          <CaretUpDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner
          className="z-10 outline-hidden"
          alignItemWithTrigger={false}
          sideOffset={8}
        >
          <Select.Popup className="border-border bg-surface text-foreground min-w-[var(--anchor-width)] rounded-xl border py-1 text-sm shadow-lg outline-hidden">
            <Select.List className="max-h-[var(--available-height)] overflow-y-auto">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="data-highlighted:bg-accent data-highlighted:text-accent-foreground grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 px-3 py-2 outline-hidden select-none"
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
  </div>
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
