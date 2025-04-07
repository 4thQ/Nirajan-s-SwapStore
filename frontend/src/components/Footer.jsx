import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-gray-200 mt-10">
      <div className="container">
        <div className="py-5 flex justify-between  items-center flex-col md:flex-row">
          <Link to="/" className="logo">
            <h1 className="text-md md:text-lg lg:text-xl font-bold">Swap Store</h1>
          </Link>
          <p>All copyright &copy; reserved by SwapStore </p>
        </div>
      </div>
    </div>
  );
};
export default Footer;
