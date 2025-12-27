import { useState } from "react";
import api from "../../../services/api/axios";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Form, Image } from "react-bootstrap";
import styles from "./checkoutPage.module.css";
import { toast } from "react-toastify";
import { useCart } from "../../../context/Cart/useCart";

const CheckoutPage = () => {
    const navigate = useNavigate();

    
    const { cart, clearCart } = useCart();

    const [shippingAddress, setShippingAddress] = useState({
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
    });

    const validateForm = () => {
        const { phone, street, city, state, zipCode, country } = shippingAddress;

        if (!phone.trim()) return "Phone number is required";
        if (!/^\d{10}$/.test(phone)) return "Phone number must be 10 digits";

        if (!street.trim()) return "Street address is required";
        if (!city.trim()) return "City is required";
        if (!state.trim()) return "State is required";

        if (!zipCode.trim()) return "Zip code is required";
        if (!/^\d{5,6}$/.test(zipCode)) return "Enter a valid 5 or 6-digit zip code";

        if (!country.trim()) return "Country is required";

        return null;
    };

    const totalAmount = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const placeOrder = async () => {
        try {
            const error = validateForm();
            if (error) {
                toast.error(error);
                return;
            }

            await api.post("/checkout/place", { shippingAddress });

            toast.success("Order placed successfully!");
            await clearCart(); 
            navigate("/order-success");

        } catch (err) {
            console.log(err);
            toast.error("Something went wrong! Try again.");
        }
    };

    return (
        <div className={`${styles.checkoutContainer} mt-4 pt-5 mt-lg-0 mt-md-4 mt-sm-3`}>
            <Row>
                
                <Col md={7} className="mb-4">
                    <h3 className={styles.sectionTitle}>Shipping Address</h3>

                    <Card className={styles.formCard}>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    className={styles.input}
                                    value={shippingAddress.phone}
                                    onChange={(e) =>
                                        setShippingAddress({ ...shippingAddress, phone: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Street</Form.Label>
                                <Form.Control
                                    className={styles.input}
                                    value={shippingAddress.street}
                                    onChange={(e) =>
                                        setShippingAddress({ ...shippingAddress, street: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>City</Form.Label>
                                        <Form.Control
                                            className={styles.input}
                                            value={shippingAddress.city}
                                            onChange={(e) =>
                                                setShippingAddress({ ...shippingAddress, city: e.target.value })
                                            }
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>State</Form.Label>
                                        <Form.Control
                                            className={styles.input}
                                            value={shippingAddress.state}
                                            onChange={(e) =>
                                                setShippingAddress({ ...shippingAddress, state: e.target.value })
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Zip Code</Form.Label>
                                        <Form.Control
                                            className={styles.input}
                                            value={shippingAddress.zipCode}
                                            onChange={(e) =>
                                                setShippingAddress({ ...shippingAddress, zipCode: e.target.value })
                                            }
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Country</Form.Label>
                                        <Form.Control
                                            className={styles.input}
                                            value={shippingAddress.country}
                                            onChange={(e) =>
                                                setShippingAddress({ ...shippingAddress, country: e.target.value })
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>

                
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

                        <h4 className={styles.totalText}>
                            Total: ₹ {totalAmount}
                        </h4>

                        <button className={styles.placeBtn} onClick={placeOrder}>
                            Place Order
                        </button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CheckoutPage;
