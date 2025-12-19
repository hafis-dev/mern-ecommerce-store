import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import OrderCard from "./OrderCard";
import { toast } from "react-toastify";
import { cancelOrder, getMyOrders } from "../../../services/api/order.service";
import styles from '.././Cart/cartPage.module.css'
const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const res = await getMyOrders();
            setOrders(res.data);
        } catch (err) {
            console.log("Order history error:", err);
        } finally {
            setLoading(false);
        }
    };


    const handleCancel = async (orderId) => {
        try {
            await cancelOrder(orderId);
            toast.success("Order cancelled!");
            loadOrders();
        } catch (err) {
            console.log(err.message)
            toast.error("Could not cancel order.");
        }
    };

    useEffect(() => {
        function fetchOrders() {
            loadOrders();
        }
        fetchOrders()
    }, []);
    if (loading) {
        return (
            <div
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "85vh" }}
            >
                <div className="spinner-border" role="status" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className={styles.empty}>
                <h3>No orders yet 📦</h3>
                <p> Orders you place will appear here.</p>
            </div>

        )
    }
    return (
        <>
            <Container className="history-container mt-4 pt-5" style={{ minHeight: "85vh" }}>

                {orders.map((order) => (
                    <OrderCard
                        key={order._id}
                        order={order}
                        onCancelOrder={(id) => handleCancel(id)}
                    />
                ))}

            </Container>
        </>
    );
};

export default OrderHistoryPage;
