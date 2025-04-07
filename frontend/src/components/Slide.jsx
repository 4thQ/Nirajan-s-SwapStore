/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const Slide = ({ image, title, link }) => {
  return (
    <div
      className="relative h-[500px] flex flex-col justify-center items-center"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 container flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>

        <Link
          to={link}
          width="200px"
          className="bg-white text-black py-3 px-5 font-semibold rounded"
        >
          Buy Now
        </Link>
      </div>
    </div>
  );
};
export default Slide;
