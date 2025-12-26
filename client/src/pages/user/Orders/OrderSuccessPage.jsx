import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./orderSuccessPage.module.css";

const OrderSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <Container
            className={`${styles.successWrapper} mt-4 pt-5 mt-lg-0 mt-md-4 mt-sm-3`}
        >
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
                        alt="success"
                        className={styles.successImage}
                    />

                    <h2 className={styles.successTitle}>
                        Order Placed Successfully!
                    </h2>

                    <p className={styles.successText}>
                        Thank you for your purchase. Your order has been placed
                        and is being processed.
                    </p>

                    <div className={styles.btnGroup}>
                        <button
                        type="button"
                            className={`${styles.baseBtn} ${styles.historyBtn}`}
                            onClick={() => navigate("/orders")}
                        >
                            View Order History
                        </button>

                        <button
                        type="button"
                            className={`${styles.baseBtn} ${styles.continueBtn}`}
                            onClick={() => navigate("/")}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default OrderSuccessPage;