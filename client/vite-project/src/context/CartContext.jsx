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


    // Auto load when logged in


    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (!token) return;

        const load = async () => {
            await loadCart();
        };

        load();
    }, []);

    return (
        <CartContext.Provider
            value={{
                cart,
                cartCount,
                loadCart,
                setCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
