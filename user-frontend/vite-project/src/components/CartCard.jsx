import { Row, Col, Image, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import styles from "./cartCard.module.css";

const CartCard = ({ item, onIncrease, onDecrease, onRemove, onClick }) => {
    const imgSrc = item.product?.images?.[0];

    return (
        <Container>
            <Row
                className={`${styles.cartRow} align-items-center justify-content-between`}
                onClick={onClick}
            >
                {/* IMAGE + DETAILS */}
                <Col xs={6} sm={6} md={6} className="d-flex gap-3">
                    <Image
                        src={imgSrc}
                        rounded
                        style={{
                            width: "75px",
                            height: "75px",
                            objectFit: "cover",
                            borderRadius: "6px",
                        }}
                    />

                    <div className="d-flex flex-column justify-content-center">
                        <p className={styles.cartTitle}>{item.product.name}</p>
                        <p className={styles.priceText}>₹{item.product.price}</p>
                    </div>
                </Col>

                {/* QUANTITY SELECTOR */}
                <Col
                    xs={3}
                    sm={3}
                    md={3}
                    className="d-flex justify-content-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.qtyBox}>
                        <button
                            className={styles.qtyBtn}
                            disabled={item.quantity <= 1}
                            onClick={onDecrease}
                        >
                            -
                        </button>

                        <span>{item.quantity}</span>

                        <button
                            className={styles.qtyBtn}
                            onClick={onIncrease}
                        >
                            +
                        </button>
                    </div>
                </Col>

                {/* REMOVE BUTTON */}
                <Col xs={2} sm={2} md={1} className="d-flex justify-content-end">
                    <button
                        className={styles.trashBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(e);
                        }}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </Col>
            </Row>
        </Container>
    );
};

export default CartCard;
