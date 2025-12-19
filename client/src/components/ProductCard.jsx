import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from "react";
import styles from "./productCard.module.css";
import { useWishlist } from "../context/Wishlist/useWishlist";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { wishlistIds, toggleWishlist } = useWishlist();

    const [animate, setAnimate] = useState(false);
    const [localWishlisted, setLocalWishlisted] = useState(false);

    useEffect(() => {
        setLocalWishlisted(wishlistIds.includes(product._id));
    }, [wishlistIds, product._id]);

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!localWishlisted) {
            setAnimate(true);
            setTimeout(() => setAnimate(false), 400);
        }

        setLocalWishlisted((prev) => !prev);

        toggleWishlist(product._id);
    };

    return (
        <Card
            className={`mb-4 ${styles.productCard}`}
            onClick={() => navigate(`/product/${product._id}`)}
        >
            <div className={styles.imageWrapper}>

                <div
                    className={`${styles.wishlistIcon} ${animate ? styles.pulse : ""}`}
                    onClick={handleWishlist}
                >
                    <FontAwesomeIcon
                        icon={localWishlisted ? solidHeart : regularHeart}
                        className={localWishlisted ? styles.wishlisted : ""}
                    />
                </div>

                <Card.Img
                    src={product.images?.[0] || "/placeholder.jpg"}
                    className={styles.productImg}
                />
            </div>

            <Card.Body className="p-1">
                <Card.Title className={styles.productTitle}>
                    {product.name}
                </Card.Title>
                <Card.Text className={styles.productPrice}>
                    ₹{product.price}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;
