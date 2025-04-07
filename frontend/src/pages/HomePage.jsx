import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import RecentProducts from "../components/RecentProducts";
import CustomSlider from "../components/Slider";
import { getRecentsItems, getWishlists } from "../http/api";
import { useAuthStore } from "../store";
import Footer from "../components/Footer";
const HomePage = () => {
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ["recents", user?._id],
    queryFn: async () => {
      return getRecentsItems(user?._id);
    },
  });
  const { data: wishlistsResponse } = useQuery({
    queryKey: ["wishlists"],
    queryFn: getWishlists,
    retry: 0,
    staleTime: 1000 * 60 * 5, // Optional: cache data for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="overflow-hidden">
        <div className="flex gap-3 my-4  h-screen w-screen justify-center items-center">
          <div className="loader"></div>
          <p className="font-semibold text-xl ml-3 uppercase">
            Items are loading....
          </p>
        </div>
      </div>
    );
  }
  const buy = data?.data?.buy;
  const rent = data?.data?.rent;
  const swap = data?.data?.swap;

  const wishlists = wishlistsResponse?.data;

  return (
    <div>
      <Navbar />
      <CustomSlider />
      <RecentProducts
        wishlists={wishlists}
        title="Latest Items for Purchase"
        data={buy}
        type="buy"
      />
      <RecentProducts
        wishlists={wishlists}
        title="Latest Items for Rent"
        data={rent}
        type="rent"
      />
      <RecentProducts
        wishlists={wishlists}
        title="Latest Items for Swap"
        data={swap}
        type="swap"
      />
      <br />
      <Footer />
    </div>
  );
};
export default HomePage;
