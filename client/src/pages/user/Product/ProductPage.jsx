import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import api from "../../../services/api/axios";
import { CartContext } from "../../../context/CartContext";
import styles from "./productPage.module.css";
import {
    faShieldHalved,
    faTruckFast,
    faCreditCard,
    faRotateLeft,
    faLock
} from "@fortawesome/free-solid-svg-icons";
import { useWishlist } from "../../../context/WishListContext";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { getProductById } from "../../../services/api/product.service";

const ProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { cart, setCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const { wishlistIds, toggleWishlist } = useWishlist();
    const [pulse, setPulse] = useState(false);

    const isWishlisted = wishlistIds.includes(id);

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");

    const isInCart = cart.some(
        (item) => (item.product?._id || item.product) === id
    );

    const addToCart = async (productId, quantity = 1) => {
        try {
            if (!user) {
                toast.error("Please login to add items to cart !");
                return;
            }
            const res = await api.post("/cart/add", { productId, quantity });
            setCart(res.data.cart.items || []);
            toast.success("Added to cart");
        } catch (err) {
            console.log("addToCart error:", err);
            toast.error("Something went wrong!");
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await getProductById(id);
                setProduct(res.data.product);
                setSelectedImage(res.data.product.images?.[0]);
            } catch (err) {
                console.log("Failed to load product", err);
            }
        };
        fetchProduct();
    }, [id]);

    if (!product)
        return <p className="text-center mt-5">Product not found</p>;

    return (
        <Container className={`py-5 ${styles.page} mt-3 mt-lg-0 mt-md-4 mt-sm-3`}>
            <Row>
                <Col md={6} className="d-flex flex-column flex-md-row">
                    <div className={styles.thumbnailOuter}>
                        <div className={`d-flex d-md-block gap-2 mb-3 mb-md-0 ${styles.thumbnailBox}`}>
                            {product.images?.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    className={`${styles.thumbnail} mb-md-2 ${selectedImage === img ? styles.thumbnailActive : ""
                                        }`}
                                    loading="lazy"
                                    onMouseOver={() => setSelectedImage(img)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className={`flex-grow-1 ms-md-3 ${styles.mainImgWrapper}`}>

                        {/* ❤️ WISHLIST ICON */}
                        <div
                            className={`${styles.wishlistIcon} ${pulse ? styles.pulse : ""}`}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                if (!user) {
                                    toast.error("Please login to use wishlist!");
                                    return;
                                }

                                // Trigger pulse ONLY when adding
                                if (!isWishlisted) {
                                    setPulse(true);
                                    setTimeout(() => setPulse(false), 400);
                                }

                                toggleWishlist(product._id);
                            }}
                        >
                            <FontAwesomeIcon
                                icon={isWishlisted ? solidHeart : regularHeart}
                                className={isWishlisted ? styles.wishlisted : ""}
                            />
                        </div>


                        <img
                            src={selectedImage}
                            className={`${styles.mainImg} shadow-sm`}
                            loading="lazy"
                        />
                    </div>

                </Col>

                <Col md={6} className="d-flex flex-column justify-content-between">
                    <h2 className={`mt-1 ${styles.brandName}`}>{product.attributes?.brand}</h2>
                    <h2 className={`mt-1 ${styles.productName}`}>{product.name}</h2>
                    <h4 className={styles.productPrice}>₹{product.price}</h4>

                    {product.stock > 0 && product.stock < 5 && (
                        <p className={styles.limitedStock}>
                            Only {product.stock} left — hurry!
                        </p>
                    )}

                    <p className={styles.productDescription}>{product.description}</p>

                    <div className={styles.attributeSection}>
                        {product.attributes && (
                            <ul className={styles.attributeList}>
                                {Object.entries(product.attributes).map(([key, value]) => (
                                    <li key={key}>
                                        <span className={styles.attrKey}>
                                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                                        </span>{" "}
                                        <span className={styles.attrValue}>{value}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {product.stock <= 0 ? (
                        <Button
                            type="button"
                            variant="secondary"
                            className={styles.addBtn}
                            disabled
                            style={{ opacity: 0.7, cursor: "not-allowed" }}
                        >
                            Out of Stock
                        </Button>
                    ) : isInCart ? (
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
                </Col>
            </Row>

            <Container className="pt-5 ps-0 mt-5">
                <h4 className={styles.highlightHeading}>Product Highlights</h4>

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
            </Container>
        </Container>
    );
};

export default ProductPage;
