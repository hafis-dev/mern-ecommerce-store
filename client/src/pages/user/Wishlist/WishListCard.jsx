import { Row, Col, Image, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import styles from "./wishlistCard.module.css";
import { useCart } from "../../../context/Cart/useCart";
import { toast } from "react-toastify";

const WishlistCard = ({ product, onRemove, onClick }) => {
    if (!product) return null;

    const imgSrc = product.images?.[0] || "https://via.placeholder.com/75";
    const { addItem } = useCart();

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (product.stock <= 0) {
            toast.error("Product out of stock");
            return;
        }
        addItem(product._id, 1);
        toast.success("Added to cart");
    };

    return (
        <Container fluid className="p-0 mb-3">
            <Row
                className={`${styles.wishlistRow} align-items-center g-0 p-2`}
                onClick={onClick}
                style={{ cursor: "pointer" }}
            >
                <Col xs={10} className="d-flex align-items-center gap-3">
                    <Image
                        src={imgSrc}
                        alt={product.name}
                        className={styles.productImage}
                    />

                    <div className="d-flex flex-column justify-content-center">
                        <h6
                            className={`m-0 text-truncate ${styles.wishlistTitle} ${styles.titleClamp}`}
                        >
                            {product.name}
                        </h6>

                        <span className={`small ${styles.priceMuted}`}>
                            ₹{product.price?.toLocaleString()}
                        </span>

                        {product.stock > 0 && product.stock < 5 && (
                            <span className={styles.lowStock}>
                                Only {product.stock} left
                            </span>
                        )}
                    </div>
                </Col>

                <Col xs={2} className="d-flex justify-content-end pe-2 gap-2">
                    <button
                        className={`${styles.cartBtn} ${product.stock <= 0 ? styles.disabledBtn : ""}`}
                        aria-label="Add to cart"
                        title={product.stock <= 0 ? "Out of stock" : "Add to cart"}
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                    >
                        <FontAwesomeIcon
                            icon={faShoppingCart}
                            className={styles.cartIcon}
                        />
                    </button>
                    <button
                        className={styles.trashBtn}
                        aria-label="Remove from wishlist"
                        title="Remove from wishlist"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(product._id);
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faTrash}
                            className={styles.trashIcon}
                        />
                    </button>
                </Col>
            </Row>
        </Container>
    );
};

export default WishlistCard;
