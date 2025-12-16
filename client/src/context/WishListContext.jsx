import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api/axios";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [wishlistIds, setWishlistIds] = useState([]);

    useEffect(() => {
        if (user) loadWishlist();
        else setWishlistIds([]);
    }, [user]);

    const loadWishlist = async () => {
        try {
            const res = await api.get("/wishlist");
            setWishlistIds(res.data.products.map(p => p._id));
        } catch {
            setWishlistIds([]);
        }
    };

    const toggleWishlist = async (productId) => {
        if (!user) {
            toast.error("Please login to use wishlist");
            return;
        }

        await api.post("/wishlist/toggle", { productId });

        setWishlistIds(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    return (
        <WishlistContext.Provider value={{ wishlistIds, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

// ⭐ ADD THIS
export const useWishlist = () => useContext(WishlistContext);
