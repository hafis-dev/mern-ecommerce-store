import {
    useEffect,
    useState,
    useCallback,
    useMemo,
    useContext,
} from "react";

import { CartContext } from "./cart.context";
import { AuthContext } from "../AuthContext";

import {
    getCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart as clearFullCart,
} from "../../services/api/cart.service";

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState([]);

    const cartCount = useMemo(
        () => cart.reduce((sum, item) => sum + item.quantity, 0),
        [cart]
    );

    const loadCart = useCallback(async () => {
        if (!user) {
            setCart([]);
            return;
        }

        try {
            const res = await getCart();
            setCart(res.data.items || []);
        } catch (err) {
            console.log("cart load error:", err);
        }
    }, [user]);

    const addItem = async (productId, quantity = 1) => {
        const res = await addToCart(productId, quantity);
        setCart(res.data.cart.items || []);
    };

    const updateQty = async (productId, quantity) => {
        if (quantity < 1) return;
        const res = await updateCartQuantity(productId, quantity);
        setCart(res.data.cart.items || []);
    };

    const removeItem = async (productId) => {
        const res = await removeFromCart(productId);
        setCart(res.data.cart.items || []);
    };
    const clearCart = async () => {
        try {
            await clearFullCart("/cart/clear");
            setCart([]);
        } catch (err) {
            console.log("clear cart error:", err);
        }
    };

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    const value = useMemo(
        () => ({
            cart,
            cartCount,
            loadCart,
            addItem,
            updateQty,
            removeItem,
            clearCart
        }),
        [cart, cartCount, loadCart]
    );

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
