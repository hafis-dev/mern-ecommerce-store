import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useWishlist } from "../../../context/WishListContext";
import api from "../../../services/api/axios";
import WishlistCard from "./WishListCard";

import styles from "./wishlistPage.module.css";

const WishlistPage = () => {
    const navigate = useNavigate();
    const { wishlistIds, toggleWishlist } = useWishlist();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWishlistProducts = async () => {
            try {
                const res = await api.get("/wishlist");
                setProducts(res.data.products || []);
            } catch {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadWishlistProducts();
    }, [wishlistIds]);

    if (loading) {
        return <div className={styles.center}>Loading wishlist...</div>;
    }

    if (products.length === 0) {
        return (
            <div className={styles.empty}>
                <h3>Your wishlist is empty 🤍</h3>
                <p>Add products you love to see them here.</p>
            </div>
        );
    }

    return (
        <Container className={`${styles.page} pt-5 mt-lg-0 mt-md-4 mt-sm-3`}>
            <h2 className={`${styles.title} mt-4`}>My Wishlist</h2>

            {products.map((product) => (
                <WishlistCard
                    key={product._id}
                    product={product}
                    onClick={() => navigate(`/product/${product._id}`)}
                    onRemove={(id) => toggleWishlist(id)}
                />
            ))}
        </Container>
    );
};

export default WishlistPage;
