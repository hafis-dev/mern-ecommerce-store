import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./orderSuccessPage.module.css";

const OrderSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <Container
            className={`${styles.successWrapper} mt-4 pt-5 mt-lg-0 mt-md-4 mt-sm-3`}
        >
            <Row className="justify-content-center w-100">
                <Col
                    md={8}
                    lg={6}
                    className="text-center d-flex flex-column align-items-center"
                >
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
                        alt="Order placed successfully"
                        className={styles.successImage}
                    />

                    <h2 className={styles.successTitle}>
                        Order Placed Successfully!
                    </h2>

                    <p className={styles.successText}>
                        Thank you for your purchase. Your order has been placed
                        and is being processed.
                    </p>

                    
                    <Row className="justify-content-center g-3 w-100">
                        <Col xs={12} sm={"auto"}>
                            <button
                                type="button"
                                className={`${styles.baseBtn} ${styles.historyBtn} `}
                                onClick={() => navigate("/orders")}
                            >
                                View Order History
                            </button>
                        </Col>

                        <Col xs={12} sm="auto">
                            <button
                                type="button"
                                className={`${styles.baseBtn} ${styles.continueBtn} `}
                                onClick={() => navigate("/")}
                            >
                                Continue Shopping
                            </button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default OrderSuccessPage;
