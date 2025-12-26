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
    const [loading, setLoading] = useState(true);

    /* ---------------- CART COUNT ---------------- */
    const cartCount = useMemo(
        () => cart.reduce((sum, item) => sum + item.quantity, 0),
        [cart]
    );

    /* ---------------- LOAD CART ---------------- */
    const loadCart = useCallback(async () => {
        if (!user) {
            setCart([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const res = await getCart();
            setCart(res.data.items || []);
        } catch (err) {
            console.log("cart load error:", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    /* ---------------- ADD ITEM ---------------- */
    const addItem = useCallback(async (productId, quantity = 1) => {
        const res = await addToCart(productId, quantity);
        setCart(res.data.cart.items || []);
    }, []);

    /* ---------------- UPDATE QTY (OPTIMISTIC) ---------------- */
    const updateQty = useCallback(async (productId, quantity) => {
        if (quantity < 1) return;

        let previousCart;

        setCart(prev => {
            previousCart = prev;
            return prev.map(item =>
                item.product._id === productId
                    ? { ...item, quantity }
                    : item
            );
        });

        try {
            const res = await updateCartQuantity(productId, quantity);
            setCart(res.data.cart.items || []);
        } catch (err) {
            console.error("Failed to update quantity:", err);
            setCart(previousCart);
            alert("Could not update quantity. Please try again.");
        }
    }, []);

    /* ---------------- REMOVE ITEM ---------------- */
    const removeItem = useCallback(async (productId) => {
        const res = await removeFromCart(productId);
        setCart(res.data.cart.items || []);
    }, []);

    /* ---------------- CLEAR CART ---------------- */
    const clearCart = useCallback(async () => {
        try {
            await clearFullCart("/cart/clear");
            setCart([]);
        } catch (err) {
            console.log("clear cart error:", err);
        }
    }, []);

    /* ---------------- LOAD ON AUTH CHANGE ---------------- */
    useEffect(() => {
        loadCart();
    }, [loadCart]);

    /* ---------------- CONTEXT VALUE ---------------- */
    const value = useMemo(
        () => ({
            cart,
            cartCount,
            loading,
            loadCart,
            addItem,
            updateQty,
            removeItem,
            clearCart,
        }),
        [
            cart,
            cartCount,
            loading,
            loadCart,
            addItem,
            updateQty,
            removeItem,
            clearCart,
        ]
    );

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
