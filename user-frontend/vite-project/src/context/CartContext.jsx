import { createContext, useEffect, useState } from "react";
import api from '../services/api/axios'

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // ==========================
    // LOAD CART
    // ==========================
    const loadCart = async () => {
        try {
            const res = await api.get("/cart");
            setCart(res.data.items || []);
        } catch (err) {
            console.log("cart load error:", err);
        }
    };

    // ==========================
    // ADD TO CART
    // ==========================
    const addToCart = async (productId, quantity = 1) => {
        try {
            const res = await api.post("/cart/add", { productId, quantity });
            setCart(res.data.cart.items || []);
        } catch (err) {
            console.log("addToCart error:", err);
        }
    };

    // ==========================
    // UPDATE ITEM
    // ==========================
    const updateCartItem = async (productId, quantity) => {
        try {
            const res = await api.put("/cart/update", { productId, quantity });
            setCart(res.data.cart.items || []);
        } catch (err) {
            console.log("update error:", err);
        }
    };

    // ==========================
    // REMOVE ITEM
    // ==========================
    const removeItem = async (productId) => {
        try {
            const res = await api.delete(`/cart/remove/${productId}`);
            setCart(res.data.cart.items || []);
        } catch (err) {
            console.log("remove error:", err);
        }
    };

    // ==========================
    // CLEAR CART
    // ==========================
    const clearCart = async () => {
        try {
            await api.delete("/cart/clear");
            setCart([]);
        } catch (err) {
            console.log("clear error:", err);
        }
    };

    // Auto load when logged in
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) loadCart();
    }, []);

    return (
        <CartContext.Provider
            value={{
                cart,
                cartCount,
                loadCart,        // 🔥 important (you missed this)
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
