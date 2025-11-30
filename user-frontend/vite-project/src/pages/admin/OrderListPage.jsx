import { useEffect, useState } from "react";
import { Container, Button, Badge, Spinner, Card } from "react-bootstrap";
import api from "../../services/api/axios";
import { toast } from "react-toastify";
import { Dropdown } from "react-bootstrap";

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
            toast.error("Failed to update");
        }
    };

    const badgeColor = (status) => {
        switch (status) {
            case "Processing": return "secondary";
            case "Shipped": return "info";
            case "Delivered": return "success";
            case "Cancelled": return "danger";
            default: return "secondary";
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
            <style>{`
                :root {
                    --c1: #fafafb;
                    --c2: #dbd9d9;
                    --c3: #beb7b3;
                    --c4: #908681;
                    --c5: #6d5a4e;
                    --c6: #1b1a19;
                }

                .orderCard {
                    background: transparent;
                    border: 1px solid var(--c2);
                    border-radius: 0px;
                    padding: 18px 20px;
                    margin-bottom: 15px;
                    cursor: pointer;
                    transition: 0.2s ease;
                }

                .orderCard:hover {
                    border-color: var(--c5);
                }

                .rowFlex {
                    display: flex;
                    gap: 20px;
                    width: 100%;
                }

                .orderInfo {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .orderHeader {
                    font-size: 18px;
                    font-weight: 700;
                    color: var(--c6);
                    margin-bottom: 5px;
                }

                .meta {
                    font-size: 14px;
                    color: var(--c4);
                }

                .itemBox {
                    padding: 10px 12px;
                    background: #f5f5f5;
                    border-radius: 6px;
                    border: 1px solid var(--c2);
                    margin-top: 10px;
                }

                .itemRow {
                    display: flex;
                    gap: 12px;
                    padding: 8px 0;
                    border-bottom: 1px solid var(--c2);
                }

                .itemRow:last-child {
                    border-bottom: none;
                }

                .itemImg {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 6px;
                    border: 1px solid var(--c3);
                }
.dropdown-menu {
    border-radius: 6px !important;
    padding: 5px 0 !important;
}

.dropdown-item {
    font-size: 14px !important;
    padding: 6px 14px !important;
}

                .actionColumn {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 8px;
                }

                .btnAct {
                    border-radius: 6px !important;
                    padding: 6px 12px !important;
                }

                .addressBox {
                    background: #f1f1f1;
                    border: 1px solid var(--c2);
                    padding: 12px;
                    border-radius: 6px;
                    margin-top: 12px;
                }

                @media(max-width: 600px) {
                    .rowFlex {
                        flex-direction: column;
                    }

                    .actionColumn {
                        flex-direction: row;
                        justify-content: space-between;
                    }
                }
            `}</style>

            <Container className="mt-4">

                <h3 style={{ fontFamily: "Urbanist", fontWeight: 700, color: "var(--c6)", marginBottom: "20px" }}>
                    All Orders
                </h3>

                {orders.map((order, index) => (
                    <Card
                        key={order._id}
                        className="orderCard"
                        onClick={() =>
                            setOrders(prev =>
                                prev.map((o, i) =>
                                    i === index ? { ...o, open: !o.open } : o
                                )
                            )
                        }
                    >
                        <div className="rowFlex">
                            <div className="orderInfo">
                                <div className="orderHeader">Order #{order._id.slice(-6)}</div>

                                <div className="meta">User: {order.userName}</div>
                                <div className="meta">Items: {order.orderItems.length}</div>
                                <div className="meta">Total: ₹{order.totalPrice}</div>

                                <Badge bg={badgeColor(order.status)} className="mt-2">
                                    {order.status}
                                </Badge>

                                <div className="meta mt-2">
                                    Placed: {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            {/* ACTION DROPDOWN */}
                            <div className="actionColumn">

                                <Dropdown onClick={(e) => e.stopPropagation()}>
                                    <Dropdown.Toggle
                                        size="sm"
                                        variant="outline-dark"
                                        className="btnAct"
                                        style={{ width: "150px", textAlign: "left" }}
                                    >
                                        Update Status
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>

                                        <Dropdown.Item onClick={() => updateStatus(order._id, "Processing")}>
                                            Processing
                                        </Dropdown.Item>

                                        <Dropdown.Item onClick={() => updateStatus(order._id, "Shipped")}>
                                            Shipped
                                        </Dropdown.Item>

                                        <Dropdown.Item onClick={() => updateStatus(order._id, "Delivered")}>
                                            Delivered
                                        </Dropdown.Item>

                                        <Dropdown.Item
                                            className="text-danger"
                                            onClick={() => updateStatus(order._id, "Cancelled")}
                                        >
                                            Cancelled
                                        </Dropdown.Item>

                                    </Dropdown.Menu>
                                </Dropdown>

                            </div>

                        </div>

                        {/* EXPANDED AREA */}
                        {order.open && (
                            <>
                                {/* ADDRESS */}
                                <div className="addressBox">
                                    <b>Address</b><br />
                                    {order.shippingAddress.street}<br />
                                    {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                                    {order.shippingAddress.country} - {order.shippingAddress.zipCode}<br />
                                    Phone: {order.shippingAddress.phone}
                                </div>

                                {/* ITEMS */}
                                <div className="itemBox">
                                    <b>Items</b>
                                    {order.orderItems.map((item) => (
                                        <div className="itemRow" key={item._id}>
                                            <img src={item.image} className="itemImg" />

                                            <div>
                                                <div><b>{item.name}</b></div>
                                                <div className="meta">Qty: {item.qty}</div>
                                                <div className="meta">₹{item.price}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                    </Card>
                ))}
            </Container>
        </>
    );
}
