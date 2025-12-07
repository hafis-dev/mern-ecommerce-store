import { useContext, useEffect } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { AdminContext } from "../../context/AdminContext";
import styles from "./dashBoard.module.css";

const DashBoard = () => {
    const { orders, loadAllOrders } = useContext(AdminContext);

    useEffect(() => {
        loadAllOrders();
    }, []);

    if (!orders || !Array.isArray(orders)) {
        return <p className="text-center mt-4">Loading dashboard...</p>;
    }

    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
    const cancelledOrders = orders.filter((o) => o.status === "Cancelled").length;

    const totalRevenue = orders
        .filter((o) => o.status !== "Cancelled")
        .reduce((sum, order) => sum + order.totalPrice, 0);

    const today = new Date().toDateString();
    const todayRevenue = orders
        .filter(
            (o) =>
                new Date(o.createdAt).toDateString() === today &&
                o.status !== "Cancelled"
        )
        .reduce((sum, order) => sum + order.totalPrice, 0);

    const statusStyle = (status) => {
        switch (status) {
            case "Delivered":
                return { background: "#c8f7dc", color: "#0d7a37" };
            case "Cancelled":
                return { background: "#ffd4d4", color: "#b30000" };
            case "Shipped":
                return { background: "#d2e9ff", color: "#0b4fa1" };
            default:
                return { background: "var(--c2)", color: "var(--c6)" };
        }
    };

    return (
        <Container className={`${styles.wrapper} py-5`}>
            <h2 className={styles.heading}>Admin Dashboard</h2>

            {/* STATS */}
            <Row className="mt-4 g-3">
                <Col md={3}>
                    <Card className={styles.statCard}>
                        <Card.Body>
                            <h6 className={styles.label}>Total Revenue</h6>
                            <h3 className={styles.value}>₹{totalRevenue}</h3>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className={styles.statCard}>
                        <Card.Body>
                            <h6 className={styles.label}>Total Orders</h6>
                            <h3 className={styles.value}>{totalOrders}</h3>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className={styles.statCard}>
                        <Card.Body>
                            <h6 className={styles.label}>Delivered Orders</h6>
                            <h3 className={styles.value}>{deliveredOrders}</h3>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className={styles.statCard}>
                        <Card.Body>
                            <h6 className={styles.label}>Cancelled Orders</h6>
                            <h3 className={styles.value}>{cancelledOrders}</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Today Revenue */}
            <Card className={`${styles.revenueCard} mt-4`}>
                <Card.Body>
                    <h6 className={styles.label}>Today's Revenue</h6>
                    <h3 className={styles.value}>₹{todayRevenue}</h3>
                </Card.Body>
            </Card>

            {/* Latest Orders */}
            <h4 className={`mt-5 ${styles.subHeading}`}>Latest Orders</h4>

            <Row className="mt-3 g-3">
                {orders.slice(0, 5).map((o) => (
                    <Col md={6} key={o._id}>
                        <Card className={styles.orderCard}>
                            <div className="d-flex justify-content-between">
                                {/* LEFT */}
                                <div>
                                    <h6 className={styles.orderUser}>{o.userName}</h6>

                                    <div className={styles.meta}>
                                        Total: <b className={styles.value}>₹{o.totalPrice}</b>
                                    </div>

                                    <div className={styles.meta}>
                                        {new Date(o.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                {/* STATUS */}
                                <div
                                    className={styles.statusBox}
                                    style={statusStyle(o.status)}
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
