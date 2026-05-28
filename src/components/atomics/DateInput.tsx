import * as React from "react";
import { IDateInputProps } from "../../types";

const DateInput: React.FC<IDateInputProps> = ({
  disabled,
  value,
  onChange,
}) => (
  <input
    type="datetime-local"
    disabled={disabled}
    value={value}
    onChange={onChange}
    style={styles.dateInput}
  />
);

const styles = {
  datePickers: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  dateInput: {
    padding: "5px",
    fontSize: "14px",
  },
};

export default DateInput;
