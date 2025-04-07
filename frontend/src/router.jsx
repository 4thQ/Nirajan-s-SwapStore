import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RootLayout from "./layouts/RootLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import ListingPage from "./pages/ListingPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import SalesPage from "./pages/SalesPage";

import MessagesPage from "./pages/MessagesPage";
import AddItemPage from "./pages/AddItemPage";
import ListingLayout from "./layouts/ListingLayout";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import EditItemPage from "./pages/EditItemPage";
import BuyOrderPage from "./pages/order/BuyOrderPage";
import RentOrderPage from "./pages/order/RentOrderPage";
import SwapOrderPage from "./pages/order/SwapOrderPage";
import OrderLayout from "./layouts/OrderLayout";
import ItemsPage from "./pages/ItemsPage";
import ItemViewPage from "./pages/ItemViewPage";
import SellerStore from "./pages/SellerStore";
import WishList from "./pages/WishList";

const router = createBrowserRouter([
  {
    path: "",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "items",
        element: <ItemsPage />,
      },
      {
        path: "items/:id",
        element: <ItemViewPage />,
      },
      {
        path: "seller/:id",
        element: <SellerStore />,
      },
      {
        path: "wishlists",
        element: <WishList />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "",
            element: <ProfilePage />,
          },
          {
            path: "listings",
            element: <ListingLayout />,
            children: [
              {
                path: "",
                element: <ListingPage />,
              },
              {
                path: "add-new",
                element: <AddItemPage />,
              },
              {
                path: ":id",
                element: <ItemDetailsPage />,
              },
              {
                path: "edit/:id",
                element: <EditItemPage />,
              },
            ],
          },
          {
            path: "my-orders",
            element: <MyOrdersPage />,
          },
          {
            path: "sales",
            element: <SalesPage />,
          },

          {
            path: "messages",
            element: <MessagesPage />,
          },
        ],
      },
      {
        path: "order",
        element: <OrderLayout />,
        children: [
          {
            path: "buy/:id",
            element: <BuyOrderPage />,
          },
          {
            path: "rent/:id",
            element: <RentOrderPage />,
          },
          {
            path: "swap/:id",
            element: <SwapOrderPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
