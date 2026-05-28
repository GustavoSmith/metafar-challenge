import * as React from "react";
import { ISelectInputProps } from "../../types";

const SelectInput: React.FC<ISelectInputProps> = ({
  value,
  onChange,
  options,
}) => (
  <select value={value} onChange={onChange} style={styles.select}>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const styles = {
  select: {
    width: "12rem",
    height: "2rem",
  },
};

export default SelectInput;
