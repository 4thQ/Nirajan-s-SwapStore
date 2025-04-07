import { Link } from "react-router-dom";
import ListCard from "../components/ListCard";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store";
import { getMyItems } from "../http/api";

const ListingPage = () => {
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ["items", user.id],
    queryFn: getMyItems,
    retry: 0,
    // staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="overflow-hidden">
        <div className="flex gap-3 my-4  h-screen w-screen justify-center items-center">
          <div className="loader"></div>
          <p className="font-semibold text-xl ml-3 uppercase">Items are Loading....</p>
        </div>
      </div>
    );
  }
  const items = data?.data;
  return (
    <div>
      {items.length === 0 ? (
        <div className="no-items-message text-center p-10">
          <h2 className="text-lg font-bold">No Items Listed</h2>
          <p className="text-gray-600 mt-2">
            You don’t have any items listed yet. Start by adding your first item to sell,
            swap, or rent!
          </p>
          <Link
            to="/dashboard/listings/add-new"
            className="mt-4 btn btn-primary w-40 mx-auto"
          >
            Add New Item
          </Link>
        </div>
      ) : (
        <>
          <div className="flex justify-between">
            <h2 className="text-xl uppercase font-semibold">My Items</h2>
            <Link className="btn btn-primary w-32" to="/dashboard/listings/add-new">
              Add New
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-5 my-7">
            {items?.map((item) => {
              return <ListCard key={item._id} item={item} />;
            })}
          </div>
        </>
      )}
    </div>
  );
};
export default ListingPage;
