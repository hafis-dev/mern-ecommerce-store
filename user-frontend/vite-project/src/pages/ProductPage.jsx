import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";

const ProductPage = () => {
    const { id } = useParams();
    const { cart, addToCart } = useContext(CartContext);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Detect if this product is already in the cart
    const isInCart = cart.some(
        (item) => (item.product._id || item.product) === id
    );

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data.product);
            } catch (err) {
                console.log("Failed to load product", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading)
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
            </div>
        );

    if (!product) return <p className="text-center mt-5">Product not found</p>;

    return (
        <Container className="mt-4">
            <Row>
                {/* IMAGES */}
                <Col md={6}>
                    <img
                        src={product.images?.[1]}
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: "420px", objectFit: "cover" }}
                        alt=""
                    />
                </Col>

                {/* DETAILS */}
                <Col md={6}>
                    <h2 className="fw-bold">{product.name}</h2>

                    <h4 className="text-primary mt-3">₹{product.price}</h4>

                    <p className="mt-3">{product.description}</p>

                    {/* BUTTON */}
                    {isInCart ? (
                        <Button
                            variant="outline-dark"
                            className="w-100 mt-4"
                            onClick={() => (window.location.href = "/cart")}
                        >
                            Go to Cart
                        </Button>
                    ) : (
                        <Button
                            variant="dark"
                            className="w-100 mt-4"
                            onClick={() => addToCart(product._id, 1)}
                        >
                            Add to Cart
                        </Button>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ProductPage;
