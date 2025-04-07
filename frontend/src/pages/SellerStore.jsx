import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getSellerItems, getWishlists, sendMessage } from "../http/api";
import profile from "../assets/default-avatar.png";
import ItemCard from "../components/ItemCard";
import { useState } from "react";
import MessageDialog from "../components/MessageDialog";
import toast from "react-hot-toast";

const SellerStore = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["items", id],
    queryFn: async () => {
      return getSellerItems(id);
    },
    retry: 0,
  });

  const { data: wishlistsResponse } = useQuery({
    queryKey: ["wishlists"],
    queryFn: getWishlists,
    retry: 0,
    staleTime: 1000 * 60 * 5,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const messageMutation = useMutation({
    mutationFn: ({ subject, content }) =>
      sendMessage({ receiverId: id, subject, content }),
    onSuccess: () => {
      toast.success("Message sent successfully!");
    },
    onError: () => {
      toast.error("Failed to send message.");
    },
  });

  const handleSendMessage = (message) => {
    messageMutation.mutate(message);
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden">
        <div className="flex gap-3 my-4 h-screen w-screen justify-center items-center">
          <div className="loader"></div>
          <p className="font-semibold text-xl ml-3 uppercase">Loading....</p>
        </div>
      </div>
    );
  }

  const user = data?.data?.user;
  const items = data?.data?.items;
  const wishlists = wishlistsResponse?.data;

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="text-center space-y-3 mb-4">
          <img
            src={user?.image ? user?.image : profile}
            className="w-32 h-32 rounded-full mx-auto"
            alt=""
          />
          <h1 className="text-xl font-semibold">
            {user?.firstName} {user?.lastName}
          </h1>
          <p>{user?.location}</p>
          <button
            className="btn btn-primary mx-auto"
            onClick={() => setIsDialogOpen(true)}
          >
            Message Seller
          </button>
        </div>

        <div className="my-8 mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {items?.map((item) => {
            return (
              <ItemCard wishlists={wishlists} key={item?._id} item={item} type="all" />
            );
          })}
        </div>
      </div>
      <Footer />
      <MessageDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSend={handleSendMessage}
      />
    </div>
  );
};

export default SellerStore;
