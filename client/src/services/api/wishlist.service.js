import api from "./axios";

export const getWishlist = () => api.get("/wishlist");
export const addOrRemoveItem = (data) => api.post("/wishlist/toggle", data);
export const clearWishlist = () => api.delete("/wishlist/clear");
