import api from "./axios"

// Add product to cart
export const getCart = () => api.get("/cart")
export const addToCart = (productId, quantity = 1) => api.post("/cart/add", { productId, quantity })
export const updateCartQuantity = (productId, quantity) => api.put("/cart/update", { productId, quantity })
export const removeFromCart = (productId) => api.delete(`/cart/remove/${productId}`)