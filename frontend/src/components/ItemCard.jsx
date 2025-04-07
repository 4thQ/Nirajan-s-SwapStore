import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ActionModal from "./ActionModal";
import Button from "./Button";
import { HeartSVG } from "../icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { toggleWishlist } from "../http/api";
import { useAuthStore } from "../store";

const ItemCard = ({ item, type, wishlists }) => {
  const { user } = useAuthStore();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState("");
  const navigate = useNavigate();
  const isInWishlist = wishlists?.find((wish) => wish?._id === item?._id);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: toggleWishlist,
    onSuccess: async (data) => {
      queryClient.invalidateQueries("wishlists");
      console.log("DATA : ", data);
    },
    onError: (err) => {
      const message = err?.response?.data?.message || "Something went wrong.";
      toast.error(message);
    },
  });

  const openModal = (action) => {
    setCurrentAction(action);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentAction("");
  };

  const handleConfirm = (action) => {
    console.log(`Confirmed ${action} for item`, item);
    return navigate(`/order/${action}/${item._id}`);
  };

  const handleWishListToggle = (id) => {
    mutation.mutate({
      itemId: id,
    });
  };

  return (
    <>
      <div className="relative flex w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
        <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
          {user && (
            <button
              className="absolute w-10 h-10 bg-white rounded-full items-center flex justify-center right-2 top-2"
              onClick={() => {
                handleWishListToggle(item?._id);
              }}
            >
              <HeartSVG fill={isInWishlist ? "#000000" : "#ffffff"} />
            </button>
          )}
          <img className="object-fill w-full" src={item?.images?.[0]} alt={item?.name} />
        </div>
        <div className="mt-4 px-5 pb-5">
          <h5 className="text-xl tracking-tight text-slate-900 h-16">{item?.name}</h5>
          <div className="mt-2 mb-5 flex items-center justify-between font-medium">
            {/* {item?.type?.rent && item?.type?.buy ? (
              <div className="flex flex-col space-y-2">
                <p>
                  <span className="text-lg font-bold text-slate-900">
                    Rent per day: ${item?.rentPerDay}
                  </span>
                </p>
                <p>
                  <span className="text-3xl font-bold text-slate-900">
                    Buy: ${item?.price}
                  </span>
                </p>
              </div>
            ) : item?.type?.rent ? (
              <p>Rent per day: ${item?.rentPerDay}</p>
            ) : item?.type?.buy ? (
              <p>
                <span className="text-3xl font-bold text-slate-900">
                  Buy: ${item?.price}
                </span>
              </p>
            ) : item?.discount ? (
              <p>
                <span className="text-3xl font-bold text-slate-900">
                  Buy: ${item?.discount}
                </span>
                <span className="text-sm text-slate-900 line-through">
                  ${item?.price}
                </span>
              </p>
            ) : (
              <p>
                <span className="text-3xl font-bold text-slate-900">
                  Buy: ${item?.price}
                </span>
              </p>
            )} */}
            <p>
              {type === "rent" ? (
                <span className="text-lg font-bold text-slate-900">
                  Rent : ${item?.rentPerDay}
                </span>
              ) : type === "buy" ? (
                <span className="text-lg font-bold text-slate-900 flex gap-2">
                  Price :{" "}
                  {item?.discount ? (
                    <div>
                      <span>${item?.discount}</span>
                      <sub className="ml-2 line-through font-normal">{item?.price}</sub>
                    </div>
                  ) : (
                    <span>${item?.price}</span>
                  )}
                </span>
              ) : type === "swap" ? (
                <span className="text-lg font-bold text-slate-900">
                  Swap with: {item?.swapWith}
                </span>
              ) : (
                <div>
                  {item?.type?.buy && (
                    <p className="text-lg font-bold text-slate-900 flex gap-2">
                      Price :{" "}
                      {item?.discount ? (
                        <div>
                          <span>${item?.discount}</span>
                          <sub className="ml-2 line-through font-normal">
                            {item?.price}
                          </sub>
                        </div>
                      ) : (
                        <span>${item?.price}</span>
                      )}
                    </p>
                  )}
                  {item?.type?.swap && (
                    <p>
                      <strong>Swap with :</strong> {item?.swapWith}
                    </p>
                  )}

                  {item?.type?.rent && (
                    <p>
                      <strong>Rent:</strong> ${item?.rentPerDay}
                    </p>
                  )}
                </div>
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link to={`/items/${item._id}`} className="btn btn-outline flex-1">
              View
            </Link>
            {type === "all" ? (
              <>
                {item?.type?.buy && (
                  <Button
                    className="btn btn-primary"
                    width="150px"
                    onClick={() => openModal("buy")}
                  >
                    Buy Now
                  </Button>
                )}
                {item?.type?.rent && (
                  <Button
                    className="btn btn-primary"
                    width="150px"
                    onClick={() => openModal("rent")}
                  >
                    Rent Now
                  </Button>
                )}

                {item?.type?.swap && (
                  <Button
                    className="btn btn-primary"
                    width="150px"
                    onClick={() => openModal("rent")}
                  >
                    Swap Now
                  </Button>
                )}
              </>
            ) : (
              <Button className="btn btn-primary flex-1" onClick={() => openModal(type)}>
                {type === "buy" ? "Buy Now" : type === "swap" ? "Swap Now" : "Rent Now"}
              </Button>
            )}
          </div>
        </div>
      </div>
      <ActionModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        action={currentAction}
        item={item}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default ItemCard;
