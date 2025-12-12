import { useState } from "react";
import { Card, Button, Image, Collapse } from "react-bootstrap";
import styles from "./orderCard.module.css";

const OrderCard = ({ order, onCancelOrder }) => {
    const [open, setOpen] = useState(false);

    const statusClass =
        order.status === "Delivered"
            ? styles.statusDelivered
            : order.status === "Cancelled"
                ? styles.statusCancelled
                : styles.statusProcessing;

    return (
        <Card className={`${styles.orderCard} mb-3`}>
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

            <Collapse in={open}>
                <div className="p-3 border-top">

                    {order.orderItems.map((item, idx) => (
                        <div key={idx} className={`${styles.itemRow} row g-2`}>
                            <div className="col-auto">
                                <Image src={item.image} className={styles.itemImg} />
                            </div>

                            <div className="col d-flex flex-column">
                                <p className={styles.itemName}>{item.name}</p>
                                <p className={`m-0 ${styles.itemQty}`}>Qty: {item.qty}</p>
                                <p className={styles.itemPrice}>₹{item.price}</p>
                            </div>
                        </div>
                    ))}

                    <div className="d-flex justify-content-end mt-3">
                        {order.status === "Processing" && (
                            <Button
                                className={styles.btnCancel}
                                onClick={(e) => {
                                    e.stopPropagation();
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
