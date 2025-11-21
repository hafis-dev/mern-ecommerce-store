import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useContext } from "react";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { cart, addToCart } = useContext(CartContext);

    // FIX: detect populated or non-populated product
    const isInCart = cart.some((item) =>
        (item.product._id || item.product) === product._id
    );

    return (
        <Card
            className="mb-4 shadow-sm product-card"
            onClick={() => navigate(`/product/${product._id}`)}
            style={{ cursor: "pointer" }}
        >
            <Card.Img
                variant="top"
                src={product.images?.[0] || "/placeholder.jpg"}
                style={{ height: "220px", objectFit: "cover" }}
            />

            <Card.Body>
                <Card.Title className="fw-semibold">{product.name}</Card.Title>
                <Card.Text className="text-dark fw-bold">
                    ₹{product.price}
                </Card.Text>

                {/* DYNAMIC BUTTON */}
                {isInCart ? (
                    <Button
                        variant="dark"
                        className="w-100"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/cart");
                        }}
                    >
                        Go to Cart
                    </Button>
                ) : (
                    <Button
                        variant="dark"
                        className="w-100"
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product._id, 1);
                        }}
                    >
                        Add to Cart
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
};

export default ProductCard;
