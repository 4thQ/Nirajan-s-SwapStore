import { Link, useNavigate } from "react-router-dom";
import { HeartSVG, MenuSVG, SearchSVG } from "../icons/index";
import { useAuthStore } from "../store";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/api";
import toast from "react-hot-toast";
import { useState } from "react";
import Notification from "./Notification";

const Navbar = ({ search = "" }) => {
  const [searchQuery, setSearchQuery] = useState(search);
  const { user, logout: logoutFromStore } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false); // State for mobile navigation

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      toast.success("Logout successfully");
      logoutFromStore();
    },
  });

  if (mutation.isError) {
    const message = mutation?.error?.response?.data?.message || "Something went wrong.";
    toast.error(message);
  }

  const handleLogout = async () => {
    mutation.mutate();
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      navigate(`/items?search=${searchQuery}`);
    }
  };

  const toggleMobileNav = () => {
    setOpen(!isOpen);
  };

  return (
    <nav className="py-3 border-b-2 border-secondary">
      <div className="container flex justify-between items-center">
        {/* LEFT */}
        <Link to="/" className="logo">
          <h1 className="text-md md:text-lg lg:text-xl font-bold">Swap Store</h1>
        </Link>
        {/* CENTER */}
        <div className="hidden md:block">
          <div className="flex items-center gap-4 bg-secondary px-4 rounded-md py-3">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="bg-transparent w-60 outline-none"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={handleKeyDown}
            />
            <SearchSVG />
          </div>
        </div>
        {/* RIGHT */}
        <div className="items-center gap-4 hidden md:flex">
          <Link to="/wishlists">
            <HeartSVG />
          </Link>
          <Notification />
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-primary w-32">
                Dashboard
              </Link>
              <button className="btn btn-outline w-32" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-outline w-28">
              Login
            </Link>
          )}
        </div>
        {/* MOBILE MENU BUTTON */}
        <button className="md:hidden" onClick={toggleMobileNav}>
          <MenuSVG />
        </button>
      </div>

      {/* MOBILE NAV */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 w-full h-full  shadow-lg">
            <button
              onClick={toggleMobileNav}
              className="absolute top-4 right-4 font-semibold text-xl"
            >
              X
            </button>
            <ul className="flex flex-col items-center justify-center h-full space-y-4">
              <li>
                <Link to="/" onClick={toggleMobileNav} className="text-lg">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/wishlists" onClick={toggleMobileNav} className="text-lg">
                  Wishlists
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link to="/dashboard" onClick={toggleMobileNav} className="text-lg">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMobileNav();
                      }}
                      className="text-lg"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" onClick={toggleMobileNav} className="text-lg">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
