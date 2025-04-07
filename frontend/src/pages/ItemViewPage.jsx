import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteItem, getItem } from "../http/api";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { useAuthStore } from "../store";
import ActionModal from "../components/ActionModal";
import profile from "../assets/default-avatar.png";
import toast from "react-hot-toast";

const ItemViewPage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [currentImage, setCurrentImage] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState("");
  const navigate = useNavigate();

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
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      toast.success("Item deleted successfully!");
      queryClient.invalidateQueries("items");
      return navigate(-1);
    },
    onError: (err) => {
      const message = err?.response?.data?.message || "Something went wrong.";
      toast.error(message);
    },
  });

  const handleDelete = () => {
    mutation.mutate(id);
  };

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
          <p className="font-semibold text-xl ml-3 uppercase">Loading....</p>
        </div>
      </div>
    );
  }
  const item = data?.data;
  return (
    <div>
      <Navbar />
      <div className="my-8">
        <div className="container">
          {item ? (
            <div className="flex gap-6 flex-col md:flex-row">
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
                  <strong>Brand:</strong> {item?.brand}
                </p>
                <p className="capitalize text-md">
                  <strong>Color:</strong> {item?.color}
                </p>
                <p className="capitalize text-md">
                  <strong>Size:</strong> {item?.size}
                </p>
                <p className="capitalize text-md">
                  <strong>Condition:</strong> {item?.condition}
                </p>
                {item?.rentPerDay && (
                  <p className="text-md">
                    <strong>Rent Per Day:</strong> ${item?.rentPerDay}
                  </p>
                )}
                {item?.swapWith && (
                  <p className="text-md">
                    <strong>Swap With:</strong> {item?.swapWith}
                  </p>
                )}
                {item?.description && (
                  <p className="text-md">
                    <strong>Description:</strong> {item?.description}
                  </p>
                )}

                {item?.owner?._id === user?._id ? (
                  <div className="flex gap-5 mt-4">
                    <Link
                      to={`/dashboard/listings/edit/${item._id}`}
                      className="btn btn-primary w-32"
                    >
                      Edit
                    </Link>
                    <button className="btn btn-outline w-32" onClick={handleDelete}>
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-4 flex-wrap">
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
                  </div>
                )}

                <br />
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold">Owner Info:</h2>
                  <div className="flex gap-4 items-center">
                    <img
                      src={item?.owner?.image ? item?.owner?.image : profile}
                      alt=""
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                      <p>
                        <strong>Name : </strong> {item?.owner?.firstName}{" "}
                        {item?.owner?.lastName}
                      </p>
                      <p>
                        {" "}
                        <strong>Location : </strong>
                        {item?.owner?.location}
                      </p>
                      <Link className="underline" to={`/seller/${item?.owner?._id}`}>
                        Visit Store
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <h1 className="text-xl font-semibold">Item not found.</h1>
          )}
        </div>
      </div>
      <ActionModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        action={currentAction}
        item={item}
        onConfirm={handleConfirm}
      />
    </div>
  );
};
export default ItemViewPage;
