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
            <h4 className="mt-5" style={{ color: COLORS.dark }}>
                Latest Orders
            </h4>

            <Table
                bordered
                hover
                className="mt-3"
                style={{ borderColor: COLORS.borderStrong }}
            >
                <thead style={{ background: COLORS.border }}>
                    <tr>
                        <th>User</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.slice(0, 5).map((o) => (
                        <tr key={o._id}>
                            <td>{o.userName}</td>
                            <td>₹{o.totalPrice}</td>
                            <td>{o.status}</td>
                            <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default DashBoard;
