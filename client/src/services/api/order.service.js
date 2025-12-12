import api from "./axios";

export const getMyOrders = () => api.get("/orders/my-orders");
export const cancelOrder = (orderId) => api.put(`/orders/cancel/${orderId}`);
export const getAllOrders = () => api.get("/orders");
export const updateOrderStatus = (orderId, status) => api.put(`/orders/status/${orderId}`,  status );