import { Row, Col, Image, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import styles from "./wishlistCard.module.css";

const WishlistCard = ({ product, onRemove, onClick }) => {
    if (!product) return null;

    const imgSrc = product.images?.[0] || "https://via.placeholder.com/75";

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

                <Col xs={2} className="d-flex justify-content-end pe-2">
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
