import * as React from "react";
import { Radio } from "@base-ui/react/radio";
import { IRadioButtonProps } from "../../types";

const RadioButton: React.FC<IRadioButtonProps> = ({ value, label }) => (
  <label className="inline-flex cursor-pointer items-center gap-1.5 text-sm">
    <Radio.Root
      value={value}
      className="flex size-4 shrink-0 items-center justify-center rounded-full border border-gray-900 bg-white p-0 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 data-checked:bg-gray-900"
    >
      <Radio.Indicator className="flex items-center justify-center before:size-2 before:rounded-full before:bg-current data-unchecked:hidden" />
    </Radio.Root>
    {label}
  </label>
);

export default RadioButton;
