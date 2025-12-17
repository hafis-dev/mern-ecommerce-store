import api from "./axios";

export const getProductById =  (id) =>  api.get(`/products/${id}`)
export const getProducts = (queryParams = "") => api.get(`/products${queryParams}`);
export const getFeaturedProducts = () => api.get("/products/featured");
export const getNewArrivalProducts = () => api.get("/products/new");

// admin

export const createProduct = (productData) => api.post("/products/create", productData);
export const updateProduct = (id, updatedData) => api.put(`/products/${id}`, updatedData);
export const deleteProduct = (id) => api.delete(`/products/${id}`);