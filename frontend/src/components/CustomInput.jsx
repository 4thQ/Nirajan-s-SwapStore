/* eslint-disable react/prop-types */
import { ErrorMessage } from "formik";

const CustomInput = ({ type = "text", placeholder, label, ...field }) => {
  const { name } = field;
  return (
    <div>
      {label && (
        <label htmlFor={name} className="text-sm font-semibold">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className="flex-grow h-10 px-3 border rounded border-grey-400 w-full"
        {...field}
      />
      <ErrorMessage name={name} component="div" className="text-red-600 text-sm" />
    </div>
  );
};

export default CustomInput;
