import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <Container
            className="d-flex justify-content-center mt-4 pt-5 mt-lg-0 mt-md-4 mt-sm-3 align-items-center text-center"
            style={{
                minHeight: "85vh",
                fontFamily: "Poppins, sans-serif",
                backgroundColor: "var(--c1)",
            }}
        >
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
                        alt="success"
                        style={{ width: "140px", marginBottom: "25px" }}
                    />

                    <h2
                        style={{
                            fontWeight: "700",
                            fontSize: "2rem",
                            color: "var(--c4)",
                        }}
                    >
                        Order Placed Successfully!
                    </h2>

                    <p
                        style={{
                            color: "var(--c4)",
                            opacity: "0.7",
                            fontSize: "1rem",
                            marginBottom: "40px",
                        }}
                    >
                        Thank you for your purchase. Your order has been placed
                        and is being processed.
                    </p>

                    {/* Buttons */}
                    <div
                        className="d-flex justify-content-center gap-3"
                        style={{ marginTop: "10px" }}
                    >
                        {/* Order History */}
                        <Button
                            style={{
                                minWidth:"200px",
                                backgroundColor: "var(--c5)",
                                borderColor: "var(--c5)",
                                padding: "10px 22px",
                                borderRadius: "0px",
                                fontWeight: "600",
                                color: "var(--c1)",
                            }}
                            onClick={() => navigate("/orders")}
                        >
                            View Order History
                        </Button>

                        {/* Continue Shopping */}
                        <Button
                            style={{
                                minWidth:"200px",
                                backgroundColor: "var(--c4)",
                                borderColor: "var(--c4)",
                                padding: "10px 22px",
                                borderRadius: "0px",
                                fontWeight: "600",
                                color: "var(--c1)",
                            }}
                            onClick={() => navigate("/")}
                        >
                            Continue Shopping
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Hover animations */}
            <style>
                {`
                button:hover {
                    opacity: 0.85 !important;
                    transform: translateY(-1px);
                    transition: 0.2s ease;
                }
                `}
            </style>
        </Container>
    );
};

export default OrderSuccessPage;
