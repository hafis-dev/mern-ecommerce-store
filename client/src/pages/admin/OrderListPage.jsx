import { useContext, useEffect, useState } from "react";
import { Container, Badge, Spinner, Card, Dropdown } from "react-bootstrap";
import { AdminContext } from "../../context/AdminContext";
import styles from "./orderListPage.module.css";
import { toast } from "react-toastify";
import { updateOrderStatus } from "../../services/api/order.service";

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

    const handleOrderStatus = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, { status: newStatus });
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
        <Container className="mt-4" style={{minHeight:"85vh"}}>
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
                                    className={styles.btnAct}
                                >
                                    Update Status
                                </Dropdown.Toggle>

                                <Dropdown.Menu className={styles.dropdownMenu}>
                                    <Dropdown.Item className={styles.dropdownItem} onClick={() => handleOrderStatus(order._id, "Processing")}>
                                        Processing
                                    </Dropdown.Item>
                                    <Dropdown.Item className={styles.dropdownItem} onClick={() => handleOrderStatus(order._id, "Shipped")}>
                                        Shipped
                                    </Dropdown.Item>
                                    <Dropdown.Item className={styles.dropdownItem} onClick={() => handleOrderStatus(order._id, "Delivered")}>
                                        Delivered
                                    </Dropdown.Item>
                                    <Dropdown.Item className={`${styles.dropdownItem} text-danger`}  
                                        onClick={() => handleOrderStatus(order._id, "Cancelled")}
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
                                            <div className={styles.itemName}><b>{item.name}</b></div>
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
