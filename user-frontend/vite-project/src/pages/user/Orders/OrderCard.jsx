import { useState } from "react";
import { Card, Button, Image, Collapse } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./orderCard.module.css";

const OrderCard = ({ order, onCancelOrder }) => {
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
            {/* TOP SECTION (CLICK TO EXPAND) */}
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

            {/* COLLAPSE: ITEMS */}
            <Collapse in={open}>
                <div className="p-3 border-top">

                    {/* LIST OF ITEMS */}
                    {order.orderItems.map((item, idx) => (
                        <div key={idx} className={`${styles.itemRow} row g-2`}>

                            {/* IMAGE */}
                            <div className="col-auto">
                                <Image src={item.image} className={styles.itemImg} rounded />
                            </div>

                            {/* NAME + PRICE + QTY */}
                            <div className="col d-flex flex-column">
                                <p className={styles.itemName}>{item.name}</p>
                                <p className="text-muted m-0">Qty: {item.qty}</p>
                                <p className={styles.itemPrice}>₹{item.price}</p>
                            </div>
                        </div>
                    ))}

                    {/* CANCEL FULL ORDER BUTTON */}
                    <div className="d-flex justify-content-end mt-3">
                        {order.status === "Processing" && (
                            <Button
                                className={styles.btnCancel}
                                onClick={(e) => {
                                    e.stopPropagation(); // stop collapse toggle
                                    onCancelOrder(order._id);
                                }}
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
