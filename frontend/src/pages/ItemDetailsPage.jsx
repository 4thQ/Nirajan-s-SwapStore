import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getItem } from "../http/api";
import { useState } from "react";

const ItemDetailsPage = () => {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ["items", id],
    queryFn: async () => {
      return getItem(id);
    },
    retry: 0,
    // staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="overflow-hidden">
        <div className="flex gap-3 my-4  h-screen w-screen justify-center items-center">
          <div className="loader"></div>
          <p className="font-semibold text-xl ml-3 uppercase">Item is loading....</p>
        </div>
      </div>
    );
  }
  const item = data?.data;
  return (
    <div>
      {item ? (
        <div className="flex gap-6">
          <div className="flex flex-col">
            <img
              src={item?.images?.[currentImage]}
              alt={item?.name}
              className="h-[400px] w-[400px]"
            />
            {item?.images?.length > 1 && (
              <div className="flex gap-3 my-5">
                {item?.images?.map((image, index) => {
                  return (
                    <img
                      src={image}
                      className={`w-24 h-24 cursor-pointer ${
                        index === currentImage ? "border-[3px] border-black" : ""
                      }`}
                      alt={item?.name}
                      key={index}
                      onClick={() => {
                        setCurrentImage(index);
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <h1 className="text-3xl font-bold">{item?.name}</h1>
            <p>
              <strong>Item Price:</strong> {item?.price}$
            </p>
            {item?.discount && (
              <p>
                <strong>Discount Price:</strong> {item?.discount}$
              </p>
            )}
            <p className="capitalize">
              <strong>Category:</strong> {item?.category}
            </p>
            <p className="capitalize text-md">
              <strong>Brand:</strong> {item.brand}
            </p>
            <p className="capitalize text-md">
              <strong>Condition:</strong> {item.condition}
            </p>
            <p className="capitalize text-md">
              <strong>Color:</strong> {item?.color}
            </p>
            <p className="capitalize text-md">
              <strong>Size:</strong> {item?.size}
            </p>
            {item.rentPerDay && (
              <p className="text-md">
                <strong>Rent Per Day:</strong> ${item.rentPerDay}
              </p>
            )}
            {item.swapWith && (
              <p className="text-md">
                <strong>Swap With:</strong> {item.swapWith}
              </p>
            )}
            {item.description && (
              <p className="text-md">
                <strong>Description:</strong> {item.description}
              </p>
            )}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Availability:</h2>
              <ul className="list-disc list-inside">
                {item.type?.buy && <li>Available for Buy</li>}
                {item.type?.rent && <li>Available for Rent</li>}
                {item.type?.swap && <li>Available for Swap</li>}
                {!item.type?.buy && !item.type?.rent && !item.type?.swap && (
                  <li>Not Available for Buy, Rent, or Swap</li>
                )}
              </ul>
            </div>
            <div className="flex gap-5 mt-4">
              <Link
                to={`/dashboard/listings/edit/${item._id}`}
                className="btn btn-primary w-32"
              >
                Edit
              </Link>
              <button className="btn btn-outline w-32">Delete</button>
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-xl font-bold">Item not found.</h1>
      )}
    </div>
  );
};
export default ItemDetailsPage;
