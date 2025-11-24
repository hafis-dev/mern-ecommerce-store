import { useState } from "react";
import { Card, Button, Image, Collapse } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./orderCard.module.css";

const OrderCard = ({ order, onCancel }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const statusClass =
        order.status === "Delivered"
            ? styles.statusDelivered
            : order.status === "Cancelled"
                ? styles.statusCancelled
                : styles.statusProcessing;

    return (
        <Card className={`${styles.orderCard} mb-3`}>
            {/* TOP BAR */}
            <div
                className="d-flex justify-content-between align-items-center p-3"
                onClick={() => setOpen(!open)}
                style={{ cursor: "pointer" }}
            >
                <div>
                    <div className={styles.orderHeader}>Order ID: {order._id}</div>

                    <div className={styles.orderMeta}>
                        Date: {new Date(order.createdAt).toLocaleString()}
                    </div>

                    <div className={styles.orderMeta}>Amount: ₹{order.totalPrice}</div>

                    <span className={`${styles.statusBadge} ${statusClass}`}>
                        {order.status}
                    </span>
                </div>

                <div style={{ fontSize: "28px", color: "#6d5a4e" }}>
                    {open ? "▴" : "▾"}
                </div>
            </div>

            {/* COLLAPSIBLE SECTION */}
            <Collapse in={open}>
                <div className="p-3 border-top">

                    {/* ITEMS */}
                    {order.orderItems.map((item, idx) => (
                        <div key={idx} className={styles.itemRow}>
                            <Image src={item.image} className={styles.itemImg} rounded />

                            <div style={{ flexGrow: 1 }}>
                                <p className={styles.itemName}>{item.name}</p>
                                <p className="text-muted">Qty: {item.qty}</p>
                            </div>

                            <div className="fw-bold">₹{item.price}</div>
                        </div>
                    ))}

                    {/* BUTTONS */}
                    <div className="d-flex justify-content-end mt-3">
                        {order.status === "Processing" && (
                            <Button
                                className={styles.btnCancel}
                                onClick={() => onCancel(order._id)}
                            >
                                Cancel Order
                            </Button>
                        )}
                    </div>
                </div>
            </Collapse>
        </Card>
    );
};

export default OrderCard;
