import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "../../../context/Wishlist/wishlist.context";
import WishlistCard from "./WishListCard";
import styles from "./wishlistPage.module.css";
import { useWishlist } from "../../../context/Wishlist/useWishlist";

const WishlistPage = () => {
    const navigate = useNavigate();
    const { wishlist, loading, toggleWishlist, clearWishlist } = useWishlist();

    if (loading) {
        return <div className={styles.center}>Loading wishlist...</div>;
    }

    if (wishlist.length === 0) {
        return (
            <div className={styles.empty}>
                <h3>Your wishlist is empty 🤍</h3>
                <p>Add products you love to see them here.</p>
            </div>
        );
    }

    return (
        <Container className={`${styles.page} pt-5 mt-lg-0 mt-md-4 mt-sm-3`}>
           

            <div className="mb-2 d-flex justify-content-end">
                <button
                    className={styles.clearBtn}
                    onClick={clearWishlist}
                >
                    Clear
                </button>
            </div>

            {wishlist.map(product => (
                <WishlistCard
                    key={product._id}
                    product={product}
                    onClick={() => navigate(`/product/${product._id}`)}
                    onRemove={() => toggleWishlist(product._id)}
                />
            ))}
        </Container>
    );
};

export default WishlistPage;
