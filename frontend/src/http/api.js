import { api } from "./client";

// AUTH API
export const signup = async (data) => {
  return api.post("/signup", data);
};

export const signin = async (data) => {
  return api.post("/signin", data);
};

export const self = async () => {
  return api.get("/self");
};

export const logout = async () => {
  return api.post("/logout");
};

// ITEM API
export const addItem = async (data) => {
  return api.post("/items", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getMyItems = async () => {
  return api.get("/items/my-items");
};

export const getMyAvailableItem = async () => {
  return api.get("/items/my-items?q=available");
};

export const getItems = async (filters) => {
  const { category, type, brand, condition, search, color, sortBy } = filters;
  const queryParams = new URLSearchParams({
    category,
    type,
    brand,
    condition,
    search,
    color,
    sortBy,
  }).toString();

  return api.get(`/items?${queryParams}`);
};

export const getItem = async (id) => {
  return api.get(`/items/details/${id}`);
};

export const updateItem = async (id, data) => {
  return api.put(`/items/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteItem = async (id) => {
  return api.delete(`/items/${id}`);
};

export const getRecentsItems = async (userID) => {
  return api.get(`/items/recents?userID=${userID}`);
};

// ORDER API
export const placeBuyOrder = async (data) => {
  return api.post("/orders/buy", data);
};

export const placeRentOrder = async (data) => {
  return api.post("/orders/rent", data);
};

export const placeSwapOrder = async (data) => {
  return api.post("/orders/swap", data);
};

export const getMyOrders = async () => {
  return api.get("/orders/my-orders");
};

// Fetch sales orders where the authenticated user is the seller
export const getSalesOrders = async () => {
  return api.get("/orders/my-sales");
};

export const updateOrder = async (data) => {
  return api.put("/orders/update", data);
};

export const getSellerItems = async (id) => {
  return api.get(`/items/seller?userID=${id}`);
};

export const getWishlists = async () => {
  return api.get(`/items/wishlists`);
};

export const toggleWishlist = async (data) => {
  return api.post(`/items/wishlists`, data);
};

export const updateProfile = async (data) => {
  return api.post("/update-profile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getNotifications = async () => api.get(`/orders/notifications`);

export const markeAsReadNotifcation = async () =>
  api.get(`/orders/notifications/markAsRead`);

export const sendMessage = async (data) => api.post(`/messages`, data);
