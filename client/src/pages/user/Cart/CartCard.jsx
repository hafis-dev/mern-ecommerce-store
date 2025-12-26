import { Row, Col, Image, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import styles from "./cartCard.module.css";

const CartCard = ({ item, onIncrease, onDecrease, onRemove, onClick }) => {
    const product = item.product || {};
    const imgSrc = product.images?.[0] || "https://via.placeholder.com/75";

    const isMaxStock = item.quantity >= (product.stock || 0);

    return (
        <Container fluid className="p-0 mb-3">
            <Row
                className={`${styles.cartRow} align-items-center g-0  p-2 `}
                onClick={onClick}
            >
                {/* IMAGE + DETAILS */}
                <Col xs={7} className="d-flex align-items-center gap-3">
                    <Image
                        src={imgSrc}
                        alt={product.name}
                        
                        className={styles.productImage}
                    />

                    <div className="d-flex flex-column justify-content-center">
                        <h6 className={`m-0 text-truncate ${styles.cartTitle} ${styles.titleClamp}`}>
                            {product.name || "Unknown Product"}
                        </h6>

                        <span className={`small ${styles.priceMuted}`}>
                            ₹{product.price?.toLocaleString() || 0}
                        </span>

                        {product.stock < 5 && (
                            <span className={styles.lowStock}>
                                Only {product.stock} left
                            </span>
                        )}
                    </div>
                </Col>

                {/* QUANTITY */}
                <Col
                    xs={3}
                    className="d-flex align-items-center justify-content-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.qtyWrapper}>
                        <button
                            className={styles.circleBtn}
                            disabled={item.quantity <= 1}
                            onClick={onDecrease}
                        >
                            −
                        </button>

                        <span className={styles.qtyValue}>{item.quantity}</span>

                        <button
                            className={`${styles.circleBtn} ${isMaxStock ? styles.disabledBtn : ""
                                }`}
                            disabled={isMaxStock}
                            onClick={onIncrease}
                        >
                            +
                        </button>
                    </div>
                </Col>


                {/* REMOVE */}
                <Col xs={2} className="d-flex justify-content-end pe-2">
                    <button
                        className={styles.trashBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(e);
                        }}
                        title="Remove item"
                    >
                        <FontAwesomeIcon icon={faTrash} className={styles.trashIcon} />
                    </button>
                </Col>
            </Row>
        </Container>
    );
};

export default CartCard;
