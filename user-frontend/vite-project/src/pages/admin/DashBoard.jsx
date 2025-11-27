import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Card, Container, Row, Col, Table } from "react-bootstrap";

const DashBoard = () => {
    const [orders, setOrders] = useState([]);
    const COLORS = {
        bg: "#fafafb",
        border: "#dbd9d9",
        borderStrong: "#beb7b3",
        textSoft: "#908681",
        accent: "#6d5a4e",
        dark: "#1b1a19",
    };

    // Fetch orders
    const loadOrders = async () => {
        try {
            const res = await api.get("/orders");
            setOrders(res.data.orders || res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    // Calculate stats
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
    const cancelledOrders = orders.filter((o) => o.status === "Cancelled").length;

    const totalRevenue = orders
        .filter((o) => o.status !== "Cancelled")
        .reduce((sum, order) => sum + order.totalPrice, 0);

    // Today's revenue
    const today = new Date().toDateString();
    const todayRevenue = orders
        .filter(
            (o) =>
                new Date(o.createdAt).toDateString() === today &&
                o.status !== "Cancelled"
        )
        .reduce((sum, order) => sum + order.totalPrice, 0);

    return (
        <Container
            className="py-5"
            style={{
                background: COLORS.bg,
                borderRadius: "16px",
                padding: "30px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
            }}
        >
            <h2 style={{ color: COLORS.dark, fontWeight: "600" }}>Admin Dashboard</h2>

            {/* Stats Cards */}
            <Row className="mt-4 g-3">
                <Col md={3}>
                    <Card
                        style={{
                            background: COLORS.bg,
                            border: `1px solid ${COLORS.borderStrong}`,
                            borderRadius: "14px",
                        }}
                    >
                        <Card.Body>
                            <h6 style={{ color: COLORS.textSoft }}>Total Revenue</h6>
                            <h3 style={{ color: COLORS.accent }}>₹{totalRevenue}</h3>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card
                        style={{
                            background: COLORS.bg,
                            border: `1px solid ${COLORS.borderStrong}`,
                            borderRadius: "14px",
                        }}
                    >
                        <Card.Body>
                            <h6 style={{ color: COLORS.textSoft }}>Total Orders</h6>
                            <h3 style={{ color: COLORS.accent }}>{totalOrders}</h3>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card
                        style={{
                            background: COLORS.bg,
                            border: `1px solid ${COLORS.borderStrong}`,
                            borderRadius: "14px",
                        }}
                    >
                        <Card.Body>
                            <h6 style={{ color: COLORS.textSoft }}>Delivered Orders</h6>
                            <h3 style={{ color: COLORS.accent }}>{deliveredOrders}</h3>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card
                        style={{
                            background: COLORS.bg,
                            border: `1px solid ${COLORS.borderStrong}`,
                            borderRadius: "14px",
                        }}
                    >
                        <Card.Body>
                            <h6 style={{ color: COLORS.textSoft }}>Cancelled Orders</h6>
                            <h3 style={{ color: COLORS.accent }}>{cancelledOrders}</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Today Revenue */}
            <Card
                className="mt-4"
                style={{
                    background: COLORS.bg,
                    border: `1px solid ${COLORS.borderStrong}`,
                    borderRadius: "14px",
                }}
            >
                <Card.Body>
                    <h6 style={{ color: COLORS.textSoft }}>Today’s Revenue</h6>
                    <h3 style={{ color: COLORS.accent }}>₹{todayRevenue}</h3>
                </Card.Body>
            </Card>

            {/* Latest Orders */}
            {/* Latest Orders */}
            <h4 className="mt-5" style={{ color: COLORS.dark }}>
                Latest Orders
            </h4>

            <Row className="mt-3 g-3">

                {orders.slice(0, 5).map((o) => (
                    <Col md={6} key={o._id}>
                        <Card
                            style={{
                                background: COLORS.bg,
                                border: `1px solid ${COLORS.borderStrong}`,
                                borderRadius: "12px",
                                padding: "14px 18px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                            }}
                        >
                            <div className="d-flex justify-content-between">

                                {/* LEFT */}
                                <div>
                                    <h6 style={{ color: COLORS.dark, marginBottom: 4 }}>
                                        {o.userName}
                                    </h6>

                                    <div style={{ fontSize: 14, color: COLORS.textSoft }}>
                                        Total: <b style={{ color: COLORS.accent }}>₹{o.totalPrice}</b>
                                    </div>

                                    <div style={{ fontSize: 14, color: COLORS.textSoft }}>
                                        {new Date(o.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                {/* RIGHT STATUS */}
                                <div
                                    style={{
                                        background:
                                            o.status === "Delivered"
                                                ? "#c8f7dc"
                                                : o.status === "Cancelled"
                                                    ? "#ffd4d4"
                                                    : o.status === "Shipped"
                                                        ? "#d2e9ff"
                                                        : "#e4e4e4",
                                        color:
                                            o.status === "Delivered"
                                                ? "#0d7a37"
                                                : o.status === "Cancelled"
                                                    ? "#b30000"
                                                    : o.status === "Shipped"
                                                        ? "#0b4fa1"
                                                        : "#555",
                                        padding: "4px 12px",
                                        borderRadius: 8,
                                        fontWeight: 600,
                                        height: "fit-content"
                                    }}
                                >
                                    {o.status}
                                </div>

                            </div>
                        </Card>
                    </Col>
                ))}

            </Row>

        </Container>
    );
};

export default DashBoard;
