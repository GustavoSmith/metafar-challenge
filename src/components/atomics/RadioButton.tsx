import * as React from "react";
import { Radio } from "@base-ui/react/radio";
import { IRadioButtonProps } from "../../types";

const RadioButton: React.FC<IRadioButtonProps> = ({ value, label }) => (
  <label className="text-foreground inline-flex cursor-pointer items-center gap-2 text-sm font-medium">
    <Radio.Root
      value={value}
      className="border-border bg-surface text-accent-foreground focus-visible:outline-accent data-checked:border-accent data-checked:bg-accent flex size-4 shrink-0 items-center justify-center rounded-full border p-0 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <Radio.Indicator className="flex items-center justify-center before:size-2 before:rounded-full before:bg-current data-unchecked:hidden" />
    </Radio.Root>
    {label}
  </label>
);

export default RadioButton;
