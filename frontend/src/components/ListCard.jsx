/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const ListCard = ({ item }) => {
  return (
    <div className="border border-gray-100 bg-white shadow-md flex flex-col justify-between">
      <img src={item?.images?.[0]} alt={item?.name} />
      <div className="p-3">
        <h3 className="font-semibold my-2">{item?.name}</h3>
        <p>{item?.description}</p>
        <div className="flex justify-between my-3">
          {item?.discount ? (
            <div className="space-x-2">
              <span className="line-through">{item.price}$</span>
              <span className="font-semibold">{item.discount}$</span>
            </div>
          ) : (
            <p className="font-semibold">{item.price}$</p>
          )}
          <p className="capitalize font-semibold">{item?.category}</p>
        </div>
        <div className="flex justify-center border-t pt-3">
          <Link to={`/dashboard/listings/${item._id}`} className="btn btn-primary w-full">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ListCard;
