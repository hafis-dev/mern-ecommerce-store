import { createContext, useEffect, useState } from "react";
import { getCart } from "../services/api/cart.service";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const loadCart = async () => {
        try {
            const res = await getCart();
            setCart(res.data.items || []);
        } catch (err) {
            console.log("cart load error:", err);
        }
    };

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
