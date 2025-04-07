/* eslint-disable react/prop-types */
import { ErrorMessage } from "formik";

const CustomTextArea = ({ label, placeholder, ...field }) => {
  const { name } = field;
  return (
    <div>
      {label && (
        <label htmlFor={name} className="text-sm font-semibold">
          {label}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        className="flex-grow py-3 px-3 border rounded border-grey-400 w-full"
        rows={3}
        {...field}
      ></textarea>
      <ErrorMessage name={name} component="div" className="text-red-600 text-sm" />
    </div>
  );
};

export default CustomTextArea;
