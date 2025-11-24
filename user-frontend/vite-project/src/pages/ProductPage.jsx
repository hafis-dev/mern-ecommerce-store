import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";
import styles from "./productPage.module.css";
import {
    faShieldHalved,
    faTruckFast,
    faCreditCard,
    faRotateLeft,
    faLock
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { loadCart, cart, addToCart } = useContext(CartContext);

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");

    const isInCart = cart.some(
        (item) => (item.product._id || item.product) === id
    );

    useEffect(() => { loadCart(); }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data.product);
                setSelectedImage(res.data.product.images?.[0]);
            } catch (err) {
                console.log("Failed to load product", err);
            }
        };
        fetchProduct();
    }, [id]);

    if (!product) return <p className="text-center mt-5">Product not found</p>;

    return (
        <Container className={`py-5 ${styles.page} mt-3 mt-lg-0 mt-md-4 mt-sm-3`}>
            <Row>
                {/* LEFT SECTION */}
                <Col md={6} className="d-flex flex-column flex-md-row">

                    {/* THUMBNAILS */}
                    <div className={`d-flex d-md-block gap-2 mb-3 mb-md-0 ${styles.thumbnailBox}`}>
                        {product.images?.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                className={`${styles.thumbnail} mb-md-2 ${selectedImage === img ? styles.thumbnailActive : ""
                                    }`}
                                onClick={() => setSelectedImage(img)}
                                loading="lazy"
                            />
                        ))}
                    </div>

                    {/* MAIN IMAGE */}
                    <div className={`flex-grow-1 ms-md-3 ${styles.mainImgWrapper}`}>
                        <img
                            src={selectedImage}
                            className={`${styles.mainImg} shadow-sm`}
                            loading="lazy"
                        />
                    </div>

                </Col>

                {/* RIGHT SECTION */}
                <Col md={6}>
                    <h2 className={styles.productName}>{product.name}</h2>
                    <h4 className={styles.productPrice}>₹{product.price}</h4>
                    <p className={styles.productDescription}>{product.description}</p>
                    <div className={styles.btnHighligts}>
                    {isInCart ? (
                        <Button
                            type="button"
                            variant="outline-dark"
                            className={styles.cartBtn}
                            onClick={() => navigate("/cart")}
                        >
                            Go to Cart
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="dark"
                            className={styles.addBtn}
                            onClick={() => addToCart(product._id, 1)}
                        >
                            Add to Cart
                        </Button>
                    )}

                    {/* HIGHLIGHTS */}
                    <div className={styles.highlights}>
                        <p className={styles.highlightItem}>
                            <FontAwesomeIcon icon={faShieldHalved} /> &nbsp;
                            <strong>100% Original Product</strong> – Quality checked and verified.
                        </p>

                        <p className={styles.highlightItem}>
                            <FontAwesomeIcon icon={faTruckFast} /> &nbsp;
                            <strong>Fast Delivery</strong> – Usually delivered within 3–5 days.
                        </p>

                        <p className={styles.highlightItem}>
                            <FontAwesomeIcon icon={faCreditCard} /> &nbsp;
                            <strong>Online Payment Only</strong> – Secure checkout available.
                        </p>

                        <p className={styles.highlightItem}>
                            <FontAwesomeIcon icon={faRotateLeft} /> &nbsp;
                            <strong>Easy Return & Exchange</strong> within 7 days.
                        </p>

                        <p className={styles.highlightItem}>
                            <FontAwesomeIcon icon={faLock} /> &nbsp;
                            <strong>Secure Payment</strong> – End-to-end encrypted checkout.
                        </p>
                    </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductPage;
