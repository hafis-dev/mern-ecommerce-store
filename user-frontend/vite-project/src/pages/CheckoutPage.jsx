import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import styles from "./checkoutPage.module.css"; // ⭐ NEW CSS FILE

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, loadCart } = useContext(CartContext);

    const [shippingAddress, setShippingAddress] = useState({
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
    });

    useEffect(() => {
        loadCart();
    }, []);

    const totalAmount = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const placeOrder = async () => {
        try {
            await api.post("/checkout/place", { shippingAddress });
            navigate("/order-success");
            loadCart()
        } catch (err) {
            alert("Something went wrong");
        }
    };

    return (
        <div className={`${styles.checkoutContainer} mt-4 pt-5 mt-lg-0 mt-md-4 mt-sm-3`} >
            <Row>
                {/* LEFT FORM */}
                <Col md={7} className="mb-4">
                    <h3 className={styles.sectionTitle}>Shipping Address</h3>

                    <Card className={styles.formCard}>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={shippingAddress.phone}
                                    onChange={(e) =>
                                        setShippingAddress({ ...shippingAddress, phone: e.target.value })
                                    }
                                    placeholder="Enter phone number"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Street</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={shippingAddress.street}
                                    onChange={(e) =>
                                        setShippingAddress({ ...shippingAddress, street: e.target.value })
                                    }
                                    placeholder="Street address"
                                />
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>City</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={shippingAddress.city}
                                            onChange={(e) =>
                                                setShippingAddress({ ...shippingAddress, city: e.target.value })
                                            }
                                            placeholder="City"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>State</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={shippingAddress.state}
                                            onChange={(e) =>
                                                setShippingAddress({ ...shippingAddress, state: e.target.value })
                                            }
                                            placeholder="State"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Zip Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={shippingAddress.zipCode}
                                            onChange={(e) =>
                                                setShippingAddress({ ...shippingAddress, zipCode: e.target.value })
                                            }
                                            placeholder="Zip code"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Country</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={shippingAddress.country}
                                            onChange={(e) =>
                                                setShippingAddress({ ...shippingAddress, country: e.target.value })
                                            }
                                            placeholder="Country"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>

                {/* RIGHT SUMMARY */}
                <Col md={5}>
                    <h3 className={styles.sectionTitle}>Order Summary</h3>

                    <Card className={styles.summaryCard}>
                        {cart.map((item, index) => (
                            <div key={index} className={styles.orderItem}>
                                <Image
                                    src={item.product.images?.[0]}
                                    className={styles.itemImg}
                                />
                                <div>
                                    <p className={styles.itemName}>{item.product.name}</p>
                                    <p className={styles.itemQty}>Qty: {item.quantity}</p>
                                    <p className={styles.itemPrice}>
                                        ₹ {item.product.price * item.quantity}
                                    </p>
                                </div>
                            </div>
                        ))}

                        <h4 className={styles.totalText}>Total: ₹ {totalAmount}</h4>

                        <Button className={styles.placeBtn} onClick={placeOrder}>
                            Place Order
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CheckoutPage;
