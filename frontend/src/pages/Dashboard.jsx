import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store";
import profile from "../assets/default-avatar.png";
import Footer from "../components/Footer";

const Dashboard = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  if (!user) {
    return <Navigate to={`/login?returnTo=${location.pathname}`} replace />;
  }
  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="my-10">
          <div className="text-center space-y-3 mb-4 ">
            <img
              src={user?.image ? user?.image : profile}
              className="w-32 h-32 rounded-full mx-auto"
              alt=""
            />
            <h1 className="text-xl font-semibold">
              {user?.firstName} {user?.lastName}
            </h1>
            <p>{user?.location}</p>
          </div>

          <div>
            {/* TAB */}
            <div className="flex gap-6 shadow-md px-4 flex-wrap">
              <NavLink
                end
                to="/dashboard"
                className="uppercase font-medium text-xs sm:text-sm lg:text-lg py-3 px-3"
              >
                Profile
              </NavLink>
              <NavLink
                to="/dashboard/listings"
                className="uppercase font-medium text-xs sm:text-sm lg:text-lg py-3 px-3"
              >
                My Items
              </NavLink>
              <NavLink
                to="/dashboard/my-orders"
                className="uppercase font-medium text-xs sm:text-sm lg:text-lg py-3 px-3"
              >
                My Orders
              </NavLink>
              <NavLink
                to="/dashboard/sales"
                className="uppercase font-medium text-xs sm:text-sm lg:text-lg py-3 px-3"
              >
                Sales Orders
              </NavLink>

              <NavLink
                to="/dashboard/messages"
                className="uppercase font-medium text-xs sm:text-sm lg:text-lg py-3 px-3"
              >
                Messages
              </NavLink>
            </div>
            {/* CONTENT */}
            <div className="py-8">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Dashboard;
