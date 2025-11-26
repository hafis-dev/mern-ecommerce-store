import { useEffect, useState } from "react";
import { Container, Table, Button, Badge, Spinner } from "react-bootstrap";
import api from "../../api/axios";
import { toast } from "react-toastify";

const COLORS = {
    bg: "#ffffff",
    border: "#dcdcdc",
    textSoft: "#757575",
    textDark: "#212121",
};

export default function OrderListPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = async () => {
        try {
            const res = await api.get("/orders");
            setOrders(res.data);
            setLoading(false);
        } catch (err) {
            toast.error("Failed to load orders");
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/status/${orderId}`, { status: newStatus });
            toast.success("Status updated!");
            loadOrders();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const badgeColor = (status) => {
        switch (status) {
            case "Processing":
                return "secondary";
            case "Shipped":
                return "info";
            case "Delivered":
                return "success";
            case "Cancelled":
                return "danger";
            default:
                return "secondary";
        }
    };

    if (loading)
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="dark" />
            </div>
        );

    return (
        <>
            {/* Global styles */}
            <style>{`
                body {
                    font-family: 'Inter', sans-serif !important;
                }

                .table th, .table td {
                    vertical-align: middle;
                    border-radius: 0 !important;
                }

                .table {
                    border-radius: 0 !important;
                }

                .order-container {
                    background: ${COLORS.bg};
                    padding: 30px;
                    border-radius: 0 !important;
                    border: 1px solid ${COLORS.border};
                }

                .order-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: ${COLORS.textDark};
                    margin-bottom: 20px;
                }

                .item-table td, .item-table th {
                    background: #fafafa !important;
                    border-radius: 0 !important;
                }
            `}</style>

            <Container className="mt-4">
                <div className="order-container">

                    <h3 className="order-title">All Orders</h3>

                    <Table bordered hover responsive>
                        <thead style={{ background: COLORS.border }}>
                            <tr>
                                <th>Order ID</th>
                                <th>User</th>
                                <th>Total</th>
                                <th>Items</th>
                                <th>Status</th>
                                <th>Placed At</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((order, index) => (
                                <>
                                    {/* MAIN ORDER ROW */}
                                    <tr
                                        key={order._id}
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            setOrders(prev =>
                                                prev.map((o, i) =>
                                                    i === index ? { ...o, open: !o.open } : o
                                                )
                                            )
                                        }
                                    >
                                        <td style={{ fontWeight: 600 }}>
                                            {order._id.slice(-6)}
                                        </td>
                                        <td>{order.userName}</td>
                                        <td>₹{order.totalPrice}</td>
                                        <td>{order.orderItems.length}</td>

                                        <td>
                                            <Badge bg={badgeColor(order.status)}>
                                                {order.status}
                                            </Badge>
                                        </td>

                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                                        <td>
                                            <div className="d-flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline-info"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateStatus(order._id, "Shipped");
                                                    }}
                                                    style={{ borderRadius: 0 }}
                                                >
                                                    Ship
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="outline-success"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateStatus(order._id, "Delivered");
                                                    }}
                                                    style={{ borderRadius: 0 }}
                                                >
                                                    Deliver
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateStatus(order._id, "Cancelled");
                                                    }}
                                                    style={{ borderRadius: 0 }}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* EXPANDED ROW */}
                                    {order.open && (
                                        <tr>
                                            <td colSpan="7" style={{ background: "#f7f7f7" }}>
                                                <strong>Items</strong>

                                                <Table
                                                    size="sm"
                                                    bordered
                                                    className="mt-2 item-table"
                                                >
                                                    <thead>
                                                        <tr>
                                                            <th>Image</th>
                                                            <th>Name</th>
                                                            <th>Qty</th>
                                                            <th>Price</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order.orderItems.map((item) => (
                                                            <tr key={item._id}>
                                                                <td>
                                                                    <img
                                                                        src={item.image}
                                                                        alt={item.name}
                                                                        width="50"
                                                                        height="50"
                                                                        style={{ borderRadius: 0 }}
                                                                    />
                                                                </td>
                                                                <td>{item.name}</td>
                                                                <td>{item.qty}</td>
                                                                <td>₹{item.price}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Container>
        </>
    );
}
