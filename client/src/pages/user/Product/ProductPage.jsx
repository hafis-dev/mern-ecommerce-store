import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import styles from "./productPage.module.css";
import {
    faShieldHalved,
    faTruckFast,
    faCreditCard,
    faRotateLeft,
    faLock
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { getProductById } from "../../../services/api/product.service";
import { useWishlist } from "../../../context/Wishlist/useWishlist";
import { useCart } from "../../../context/Cart/useCart";

const ProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    const { cart, addItem } = useCart();

    const { user } = useContext(AuthContext);
    const { wishlistIds, toggleWishlist } = useWishlist();
    const [pulse, setPulse] = useState(false);

    const isWishlisted = wishlistIds.includes(id);

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");

    const isInCart = cart.some(
        (item) => (item.product?._id || item.product) === id
    );

    const handleAddToCart = async () => {
        if (!user) {
            toast.error("Please login to add items to cart !");
            return;
        }

        try {
            setAdding(true);
            await addItem(product._id, 1);
            toast.success("Added to cart");
        } catch {
            toast.error("Something went wrong!");
        } finally {
            setAdding(false);
        }
    };


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await getProductById(id);
                setProduct(res.data.product);
                setSelectedImage(res.data.product.images?.[0]);
            } catch (err) {
                console.log("Failed to load product", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);


    if (loading) {
        return (
            <div
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "85vh" }}
            >
                <div className="spinner-border" role="status" />
            </div>
        );
    }

    if (!product) {
        return <p className="text-center mt-5">Product not found</p>;
    }

    return (
        <Container className={`py-5 ${styles.page} mt-4 mt-lg-0 mt-md-5 mt-sm-5`}>
            <Row>
                <Col md={6} className="d-flex flex-column flex-lg-row">
                    <div className={`order-2 order-lg-1 mt-3 mt-lg-0 ${styles.thumbnailOuter}`}>
                        <div className={`d-flex d-lg-block gap-2  mb-3 mb-lg-0 ${styles.thumbnailBox}`}>
                            {product.images?.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    className={`${styles.thumbnail} mb-lg-2 ${selectedImage === img ? styles.thumbnailActive : ""
                                        }`}
                                    loading="lazy"
                                    onMouseOver={() => setSelectedImage(img)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="order-1  order-lg-2 ms-lg-3 position-relative" style={{
                        maxWidth: "500px",
                    }}>
                        <div
                            className={`${styles.wishlistIcon} ${pulse ? styles.pulse : ""}`}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                if (!user) {
                                    toast.error("Please login to use wishlist!");
                                    return;
                                }

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
                            className={styles.mainImg}
                            loading="lazy"
                        />
                    </div>

                </Col>

                <Col md={6} className="d-flex flex-column justify-content-md-start">
                    <h2 className={`mb-0 ${styles.brandName}`}>{product.attributes?.brand}</h2>
                    <h2 className={`${styles.productName}`}>{product.name}</h2>
                    {product.stock > 0 && product.stock < 5 && (
                        <p className={styles.limitedStock}>
                            Only {product.stock} left — hurry!
                        </p>
                    )}

                    <h4 className={`mb-2 mt-0 mb-sm-2 mb-xl-4 ${styles.productPrice}`}>₹{product.price}</h4>

                 
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
                        <button
                            type="button"
                            variant="secondary"
                            className={`${styles.addBtn}`}
                            disabled
                            style={{ opacity: 0.7, cursor: "not-allowed" }}
                        >
                            Out of Stock
                        </button>
                    ) : isInCart ? (
                        <button
                            type="button"
                            variant="outline-dark"
                            className={`${styles.cartBtn}`}
                            onClick={() => navigate("/cart")}
                        >
                            Go to Cart
                        </button>
                    ) : (
                        <button
                            className={styles.addBtn}
                            onClick={handleAddToCart}
                            disabled={adding}
                        >
                            {adding ? "Adding..." : "Add to Cart"}
                        </button>

                    )}
                </Col>
            </Row>

            <Container className="ps-0 mt-0 mt-md-5 mt-lg-5  pt-lg-5">
                <h4 className={styles.highlightHeading}>Product Highlights</h4>

                <div className={styles.highlights}>
                    <p className={styles.highlightItem}>
                        <FontAwesomeIcon icon={faShieldHalved} />{" "}
                        <strong>100% Original Product</strong>
                    </p>
                    <p className={styles.highlightItem}>
                        <FontAwesomeIcon icon={faTruckFast} />{" "}
                        <strong>Fast Delivery</strong>
                    </p>
                    <p className={styles.highlightItem}>
                        <FontAwesomeIcon icon={faCreditCard} />{" "}
                        <strong>Multiple Payment Options (Online & COD)</strong>
                    </p>

                    <p className={styles.highlightItem}>
                        <FontAwesomeIcon icon={faRotateLeft} />{" "}
                        <strong>Easy Return & Exchange</strong>
                    </p>
                    <p className={styles.highlightItem}>
                        <FontAwesomeIcon icon={faLock} />{" "}
                        <strong>Secure Payment</strong>
                    </p>
                </div>
            </Container>
        </Container>
    );
};

export default ProductPage;
