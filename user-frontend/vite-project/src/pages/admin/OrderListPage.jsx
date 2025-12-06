import { useContext, useEffect, useState } from "react";
import { Container, Badge, Spinner, Card, Dropdown } from "react-bootstrap";
import { AdminContext } from "../../context/AdminContext";
import styles from "./OrderListPage.module.css";
import api from "../../services/api/axios";
import { toast } from "react-toastify";

export default function OrderListPage() {

    const {
        orders,
        loadAllOrders,
        toggleOrderOpen
    } = useContext(AdminContext);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            await loadAllOrders();
            setLoading(false);
        };
        fetchOrders();
    }, []);

    const badgeColor = (status) => {
        switch (status) {
            case "Processing": return "secondary";
            case "Shipped": return "info";
            case "Delivered": return "success";
            case "Cancelled": return "danger";
            default: return "secondary";
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/status/${orderId}`, { status: newStatus });
            toast.success("Status updated!");

            await loadAllOrders();
        } catch (err) {
            console.log(err)
            toast.error("Failed to update status");
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="dark" />
            </div>
        );
    }

    return (
        <Container className="mt-4">
            <h3 className={styles.heading}>All Orders</h3>

            {orders.map((order, index) => (
                <Card
                    key={order._id}
                    className={styles.orderCard}
                    onClick={() => toggleOrderOpen(index)}
                >
                    <div className={styles.rowFlex}>
                        <div className={styles.orderInfo}>
                            <div className={styles.orderHeader}>
                                Order #{order._id.slice(-6)}
                            </div>

                            <div className={styles.meta}>User: {order.userName}</div>
                            <div className={styles.meta}>Items: {order.orderItems.length}</div>
                            <div className={styles.meta}>Total: ₹{order.totalPrice}</div>

                            <Badge bg={badgeColor(order.status)} className={`mt-2 ${styles.statusBar}`}>
                                {order.status}
                            </Badge>

                            <div className={`${styles.meta} mt-2`}>
                                Placed: {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                        </div>

                        <div className={styles.actionColumn}>
                            <Dropdown onClick={(e) => e.stopPropagation()}>
                                <Dropdown.Toggle
                                    size="sm"
                                    variant="outline-dark"
                                    className={styles.btnAct}
                                >
                                    Update Status
                                </Dropdown.Toggle>

                                <Dropdown.Menu className={styles.dropdownMenu}>
                                    <Dropdown.Item onClick={() => updateOrderStatus(order._id, "Processing")}>
                                        Processing
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => updateOrderStatus(order._id, "Shipped")}>
                                        Shipped
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => updateOrderStatus(order._id, "Delivered")}>
                                        Delivered
                                    </Dropdown.Item>
                                    <Dropdown.Item className="text-danger"
                                        onClick={() => updateOrderStatus(order._id, "Cancelled")}
                                    >
                                        Cancelled
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>

                    {order.open && (
                        <>
                            <div className={styles.addressBox}>
                                <b>Address</b><br />
                                {order.shippingAddress.street}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                                {order.shippingAddress.country} - {order.shippingAddress.zipCode}<br />
                                Phone: {order.shippingAddress.phone}
                            </div>

                            <div className={styles.itemBox}>
                                <b>Items</b>
                                {order.orderItems.map((item) => (
                                    <div className={styles.itemRow} key={item._id}>
                                        <img src={item.image} className={styles.itemImg} />
                                        <div>
                                            <div><b>{item.name}</b></div>
                                            <div className={styles.meta}>Qty: {item.qty}</div>
                                            <div className={styles.meta}>₹{item.price}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </Card>
            ))}
        </Container>
    );
}
