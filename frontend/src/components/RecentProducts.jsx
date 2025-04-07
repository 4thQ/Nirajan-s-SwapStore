/* eslint-disable react/prop-types */
import ItemCard from "./ItemCard";

const RecentProducts = ({ title, data, type, wishlists }) => {
  return (
    <div className="py-10 container">
      <div className="heading my-10">
        <h1>{title}</h1>
      </div>
      {data?.length === 0 ? (
        <p className="text-xl text-center">
          {type === "rent"
            ? "No items available for rent at the moment."
            : type === "buy"
            ? "No items available for sale right now"
            : "No items available for swap currently"}
        </p>
      ) : (
        <div className="container  flex flex-wrap gap-6 items-center justify-center">
          {data?.map((item) => {
            return (
              <div key={item._id} className="w-[320px]">
                <ItemCard wishlists={wishlists} item={item} type={type} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentProducts;
