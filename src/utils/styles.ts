import { StylesConfig } from "react-select"

type PeriodOption = {
  value: string;
  label: string;
};

export const periodSelectStyles: StylesConfig<PeriodOption, false> = {
  control: (base) => ({
    ...base,
    border: "none",
    boxShadow: "none",
    textAlign: "center",
    cursor: "pointer",
    borderBottomLeftRadius: "8px",
    borderBottomRightRadius: "8px",
  }),
  menu: (base) => ({
    ...base,
    marginTop: -1.5
  }),
  valueContainer: (base) => ({
    ...base,
    justifyContent: "center",
  }),
  singleValue: (base) => ({
    ...base,
    position: "static",
    transform: "none",
    textAlign: "center",
    width: "100%",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: () => ({
    display: "none",
  }),
};