import { Row, Col, Image, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import styles from "./cartCard.module.css";

const CartCard = ({ item, onIncrease, onDecrease, onRemove, onClick }) => {
    // 1. Safe access to product data
    const product = item.product || {};
    const imgSrc = product.images?.[0] || "https://via.placeholder.com/75"; // Fallback image

    // 2. Check if stock limit is reached
    const isMaxStock = item.quantity >= (product.stock || 0);

    return (
        <Container fluid className="p-0 mb-3">
            <Row
                className={`${styles.cartRow} align-items-center g-0 shadow-sm p-2 bg-white rounded`}
                onClick={onClick}
                style={{ cursor: "pointer" }}
            >
                {/* IMAGE + DETAILS (Col 7) */}
                <Col xs={7} className="d-flex align-items-center gap-3">
                    <Image
                        src={imgSrc}
                        alt={product.name}
                        rounded
                        style={{
                            width: "75px",
                            height: "75px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid #eee"
                        }}
                    />

                    <div className="d-flex flex-column justify-content-center">
                        <h6 className={`m-0 text-truncate ${styles.cartTitle}`} style={{ maxWidth: "150px" }}>
                            {product.name || "Unknown Product"}
                        </h6>
                        <span className="text-muted small">
                            {/* Format price nicely: ₹1,200 */}
                            ₹{product.price?.toLocaleString() || 0}
                        </span>

                        {/* Show "Only X left" if stock is low */}
                        {product.stock < 5 && (
                            <span className="text-danger" style={{ fontSize: "10px" }}>
                                Only {product.stock} left
                            </span>
                        )}
                    </div>
                </Col>

                {/* QUANTITY SELECTOR (Col 3) */}
                <Col xs={3} className="d-flex flex-column align-items-center justify-content-center" onClick={(e) => e.stopPropagation()}>
                    <div className={styles.qtyBox}>
                        <button
                            className={styles.qtyBtn}
                            disabled={item.quantity <= 1}
                            onClick={onDecrease}
                        >
                            -
                        </button>

                        <span className="mx-2 fw-bold">{item.quantity}</span>

                        <button
                            className={styles.qtyBtn}
                            disabled={isMaxStock} // ⭐ STOCK LIMIT
                            onClick={onIncrease}
                            style={isMaxStock ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
                        >
                            +
                        </button>
                    </div>
                    {/* Visual feedback if max reached */}
                    {isMaxStock && (
                        <span style={{ fontSize: "9px", color: "red", marginTop: "2px" }}>Max</span>
                    )}
                </Col>

                {/* REMOVE BUTTON (Col 2) */}
                <Col xs={2} className="d-flex justify-content-end pe-2">
                    <button
                        className={styles.trashBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(e);
                        }}
                        title="Remove item"
                    >
                        <FontAwesomeIcon icon={faTrash} className="text-danger" />
                    </button>
                </Col>
            </Row>
        </Container>
    );
};

export default CartCard;