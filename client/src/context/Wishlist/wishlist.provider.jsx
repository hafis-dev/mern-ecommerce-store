import {  useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { toast } from "react-toastify";
import { addOrRemoveItem, clearWishlist as clearFullWishlist, getWishlist } from "../../services/api/wishlist.service";
import { WishlistContext } from "./wishlist.context";

export const WishlistProvider = ({ children }) => {
    const { user } = useContext(AuthContext);

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) loadWishlist();
        else setWishlist([]);
    }, [user]);

    const loadWishlist = async (showLoader = true) => {
        try {
            if (showLoader) setLoading(true);

            const res = await getWishlist();
            setWishlist(res.data.products || []);
        } catch {
            setWishlist([]);
        } finally {
            if (showLoader) setLoading(false);
        }
    };


    const toggleWishlist = async (productId) => {
        if (!user) {
            toast.error("Please login to use wishlist");
            return;
        }

        const exists = wishlist.some(p => p._id === productId);

        if (exists) {
            setWishlist(prev => prev.filter(p => p._id !== productId));
        }

        try {
            await addOrRemoveItem({ productId });
            loadWishlist(false);
        } catch {
            toast.error("Wishlist update failed");
            loadWishlist(false);
        }
    };



    const clearWishlist = async () => {
        if (!user) return;

        try {
            await clearFullWishlist();
            setWishlist([]);
            toast.success("Wishlist cleared");
        } catch {
            toast.error("Failed to clear wishlist");
        }
    };
    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                wishlistIds: wishlist.map(p => p._id),
                loading,
                toggleWishlist,
                clearWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};