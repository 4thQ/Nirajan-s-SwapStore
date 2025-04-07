/* eslint-disable react/prop-types */
import { ErrorMessage, useField } from "formik";
import Select from "react-select";

const CustomSelect = ({
  options,
  label,
  placeholder = "Select",
  classNames,
  isSearchable,
  ...props
}) => {
  // eslint-disable-next-line no-unused-vars
  const [field, meta, helpers] = useField(props.name);
  const { name } = props;

  const handleChange = (selectedOption) => {
    helpers.setValue(selectedOption ? selectedOption.value : "");
  };
  return (
    <div className={`w-full ${classNames}`}>
      <label className="block mb-1 font-semibold text-xs">{label}</label>
      <Select
        options={options}
        {...props}
        placeholder={placeholder}
        value={options?.find((option) => option.value === field.value)}
        onChange={handleChange}
        isSearchable={isSearchable}
        className="capitalize"
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            borderRadius: "4px",
            padding: "0 12px",
            outlineColor: "black",
            border: "1px solid #eee",
            fontSize: "16px",
            textTransform: "capitalize",
            height: "40px",
          }),
          indicatorSeparator: (baseStyles) => ({
            ...baseStyles,
            display: "none",
          }),
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary25: "#eee",
            primary: "#000000",
          },
        })}
      />
      <ErrorMessage name={name} component="div" className="text-red-600 text-sm" />
    </div>
  );
};
export default CustomSelect;
