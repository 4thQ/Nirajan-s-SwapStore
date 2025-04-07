import { Link, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store";

const OrderLayout = () => {
  const { user } = useAuthStore();
  return (
    <div>
      <Navbar />
      {user ? (
        <Outlet />
      ) : (
        <div className="container text-center">
          <p className="mt-10 mb-3">
            You must be logged in to place an order. Please log in or sign up to continue.
          </p>
          <Link to="/login" className="btn btn-primary w-32 mx-auto">
            Login
          </Link>
        </div>
      )}
    </div>
  );
};
export default OrderLayout;
