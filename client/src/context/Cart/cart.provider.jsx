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
    const [updatingId, setUpdatingId] = useState(null);

    const cartCount = useMemo(
        () => cart.reduce((sum, item) => sum + item.quantity, 0),
        [cart]
    );

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

    const addItem = useCallback(async (productId, quantity = 1) => {
        setCart(prev => [
            ...prev,
            {
                product: { _id: productId },
                quantity
            }
        ]);

        try {
            const res = await addToCart(productId, quantity);
            setCart(res.data.cart.items || []);
        } catch (err) {
            console.error("addToCart error:", err);
            loadCart();
        }
    }, [loadCart]);

    const updateQty = useCallback(async (productId, quantity) => {
        if (quantity < 1) return;

        setUpdatingId(productId);

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
        } finally {
            setUpdatingId(null);
        }
    }, []);

    const removeItem = useCallback(async (productId) => {
        const res = await removeFromCart(productId);
        setCart(res.data.cart.items || []);
    }, []);

    const clearCart = useCallback(async () => {
        try {
            await clearFullCart("/cart/clear");
            setCart([]);
        } catch (err) {
            console.log("clear cart error:", err);
        }
    }, []);

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    const value = useMemo(
        () => ({
            cart,
            cartCount,
            loading,
            updatingId,
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
            updatingId,
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
