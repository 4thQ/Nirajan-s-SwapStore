import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { self } from "../http/api";

const RootLayout = () => {
  const { setUser } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ["self"],
    queryFn: self,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setUser(data.data.user);
    }
  }, [data, setUser]);

  if (isLoading) {
    return (
      <div className="overflow-hidden">
        <div className="flex gap-3 my-4 h-screen w-screen justify-center items-center">
          <div className="loader"></div>
          <p className="font-semibold text-xl ml-3 uppercase">Item is loading ok....</p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Outlet />
      <Toaster position="top-right" />
    </div>
  );
};
export default RootLayout;
