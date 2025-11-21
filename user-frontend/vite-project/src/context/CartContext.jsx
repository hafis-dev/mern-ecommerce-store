import { createContext, useEffect, useState } from "react";
import api from '../api/axios'

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Load Cart
    const loadCart = async () => {
        try {
            const res = await api.get("/cart");
            setCart(res.data.items || []);
        } catch (err) {
            console.log("cart load error:", err);
        }
    };

    // Add to cart
    const addToCart = async (productId, quantity = 1) => {
        try {
            const res = await api.post("/cart/add", { productId, quantity });
            setCart(res.data.cart.items);
        } catch (err) {
            console.log("addToCart error:", err);
        }
    };

    // Update item
    const updateCartItem = async (productId, quantity) => {
        try {
            const res = await api.put("/cart/update", { productId, quantity });
            setCart(res.data.cart.items);
        } catch (err) {
            console.log("update error:", err);
        }
    };

    // Remove item
    const removeItem = async (productId) => {
        try {
            const res = await api.delete(`/cart/remove/${productId}`);
            setCart(res.data.cart.items);
        } catch (err) {
            console.log("remove error:", err);
        }
    };

    // Clear cart
    const clearCart = async () => {
        try {
            await api.delete("/cart/clear");
            setCart([]);
        } catch (err) {
            console.log("clear error:", err);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            loadCart();   // only load cart when logged in
        }
    }, []);


    return (
        <CartContext.Provider
            value={{
                cart,
                cartCount,       // 🔥 useful for navbar icon
                addToCart,
                updateCartItem,
                removeItem,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
