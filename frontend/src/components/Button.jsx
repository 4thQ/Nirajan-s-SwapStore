/* eslint-disable react/prop-types */
const Button = ({
  children,
  isPending,
  variant = "primary",
  width = "100%",
  ...otherProps
}) => {
  // Define the base styles for different variants
  const baseStyles = {
    black: "bg-black text-white hover:bg-black",
    red: "bg-red text-white hover:bg-red",
    primary: "bg-primary hover:bg-primaryHover text-white",
    danger: "bg-red hover:bg-red text-white",
  };

  const buttonStyles = `rounded py-2 px-5 outline-none border-none cursor-pointer transition-all duration-300 ease-linear font-semibold flex justify-center items-center gap-x-2 ${baseStyles[variant]}`;

  return (
    <button className={buttonStyles} style={{ width }} {...otherProps}>
      {isPending && (
        <span className="animate-spin">
          <CircleSVG />
        </span>
      )}
      {children}
    </button>
  );
};

const CircleSVG = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.45001 14.97C3.52001 18.41 6.40002 21.06 9.98002 21.79"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.04999 10.98C2.55999 5.93 6.81998 2 12 2C17.18 2 21.44 5.94 21.95 10.98"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.01 21.8C17.58 21.07 20.45 18.45 21.54 15.02"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Button;
