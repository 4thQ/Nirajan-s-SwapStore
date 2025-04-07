import { useQuery } from "@tanstack/react-query";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { getWishlists } from "../http/api";
import ItemCard from "../components/ItemCard";
import { useAuthStore } from "../store";
import { Link } from "react-router-dom";

const WishList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["wishlists"],
    queryFn: getWishlists,
    retry: 0,
    staleTime: 1000 * 60 * 5, // Optional: cache data for 5 minutes
  });
  const { user } = useAuthStore();

  if (isLoading) {
    return (
      <div className="overflow-hidden">
        <div className="flex gap-3 my-4  h-screen w-screen justify-center items-center">
          <div className="loader"></div>
          <p className="font-semibold text-xl ml-3 uppercase">Loading....</p>
        </div>
      </div>
    );
  }

  const items = data?.data;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 mt-8">Your Wishlist</h1>
        {user ? (
          <div className="min-h-[63vh]">
            {items && items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <ItemCard
                    wishlists={items}
                    key={item._id}
                    item={item}
                    type={item.type}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-3xl font-semibold">
                Your wishlist is empty.
              </p>
            )}
          </div>
        ) : (
          <div>
            Login to view your wishlist.{" "}
            <Link className="btn btn-primary w-32 my-3" to="/login">
              Login
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WishList;
