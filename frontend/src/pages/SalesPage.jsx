import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSalesOrders, updateOrder } from "../http/api";
import { format } from "date-fns";
import toast from "react-hot-toast";

const SalesPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["sales-orders"],
    queryFn: getSalesOrders,
  });

  const mutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      toast.success("Order status updated successfully!");
      queryClient.invalidateQueries(["sales-orders"]);
    },
    onError: (err) => {
      const message = err?.response?.data?.message || "Something went wrong.";
      toast.error(message);
    },
  });

  const handleStatusChange = async (newStatus, orderId) => {
    mutation.mutate({ orderId, status: newStatus });
  };

  const orders = data?.data?.sales;

  if (isLoading) {
    return (
      <div className="overflow-hidden">
        <div className="flex gap-3 my-4  h-screen w-screen justify-center items-center">
          <div className="loader"></div>
          <p className="font-semibold text-xl ml-3 uppercase">Sales are loading....</p>
        </div>
      </div>
    );
  }
  return (
    <div>
      {orders?.length === 0 ? (
        <div className="no-orders-message text-center p-10">
          <h2 className="text-lg font-bold">No Sales Yet</h2>
          <p className="text-gray-600 mt-2">
            You haven’t made any sales yet. Start listing your items for sale or check
            back once you start selling.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders?.map((order) => (
            <div
              key={order._id}
              className={`border rounded-lg shadow-md p-4 bg-white space-y-3 ${
                order?.item?.name ? "" : "opacity-60"
              }`}
            >
              <h2 className="text-sm mb-2">Order ID: {order._id}</h2>
              {order?.item?.name ? (
                <p className="text-lg font-semibold">Item: {order.item.name}</p>
              ) : (
                <p className="text-red-600 text-xl">Product is deleted</p>
              )}

              <p className="text-gray-600 capitalize">Order Type: {order.type}</p>
              <div className="flex gap-8 flex-wrap">
                <p className="text-gray-600 capitalize">
                  Customer Name: {order?.buyer?.firstName} {order?.buyer?.lastName}
                </p>
                <p className="text-gray-600">Customer Email: {order?.buyer?.email}</p>
                <p className="text-gray-600">
                  Customer Phone Number: {order?.phoneNumber}
                </p>
                <p className="text-gray-600">Customer Address: {order?.address}</p>
              </div>
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
              {order?.status === "pending" && order?.item?.name && (
                <div className="flex gap-4">
                  <button
                    className="btn btn-outline w-48"
                    onClick={() => handleStatusChange("accepted", order._id)}
                  >
                    Accept Order
                  </button>
                  <button
                    className="btn btn-primary w-48"
                    onClick={() => handleStatusChange("canceled", order._id)}
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default SalesPage;
