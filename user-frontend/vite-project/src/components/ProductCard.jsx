import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./productCard.module.css";
// import { CartContext } from "../context/CartContext";
// import { useContext } from "react";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    // const { cart, addToCart } = useContext(CartContext);

    // FIX: detect populated or non-populated product
    // const isInCart = cart.some((item) =>
    //     (item.product._id || item.product) === product._id
    // );

    return (
        <Card
            className={`mb-4 product-card  ${styles.productCard}`}
            onClick={() => navigate(`/product/${product._id}`)}
        >
            <div className={styles.imageWrapper}>
                <Card.Img
                    variant="top"
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
