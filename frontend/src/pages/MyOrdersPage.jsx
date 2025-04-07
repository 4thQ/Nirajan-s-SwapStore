import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "../http/api";
import { format } from "date-fns";

const MyOrdersPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["myorders"],
    queryFn: getMyOrders,
  });

  const orders = data?.data?.orders;
  if (isLoading) {
    return (
      <div className="overflow-hidden">
        <div className="flex gap-3 my-4  h-screen w-screen justify-center items-center">
          <div className="loader"></div>
          <p className="font-semibold text-xl ml-3 uppercase">Orders are loading....</p>
        </div>
      </div>
    );
  }
  return (
    <div>
      {orders?.length === 0 ? (
        <div className="no-orders-message text-center p-10">
          <h2 className="text-lg font-bold">No Orders Yet</h2>
          <p className="text-gray-600 mt-2">
            You don’t have any orders yet. Start browsing and making purchases to see them
            here.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders?.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg shadow-md p-4 bg-white space-y-3"
            >
              <h2 className="text-sm mb-2">Order ID: {order._id}</h2>
              {order?.item?.name ? (
                <p className="text-lg font-semibold">Item: {order.item.name}</p>
              ) : (
                <p className="text-red-600 text-xl">Product is deleted</p>
              )}
              <p className="text-gray-600 capitalize">Order Type: {order.type}</p>
              <p className="text-gray-600 capitalize">Status: {order.status}</p>
              <p className="text-gray-600">Message: {order.message}</p>
              {order?.type !== "swap" && (
                <p className="text-gray-600">Amount: ${order.amount}</p>
              )}
              {order.type === "rent" && (
                <p className="text-gray-600">Rent Duration: {order.rentDuration} days</p>
              )}
              {order.type === "swap" && (
                <p className="text-gray-600">Swap Item: {order.swapItem.name}</p>
              )}
              <p className="text-gray-600">
                Order Date: {format(new Date(order.createdAt), "MMMM dd, yyyy")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default MyOrdersPage;
