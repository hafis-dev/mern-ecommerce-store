import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import OrderCard from "../components/OrderCard";
import { toast } from "react-toastify";

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    const loadOrders = async () => {
        try {
            const res = await api.get("/orders/my-orders");
            setOrders(res.data);
        } catch (err) {
            console.log("Order history error:", err);
        }
    };

    // ONLY full order cancellation allowed
    const cancelOrder = async (orderId) => {
        try {
            await api.put(`/orders/cancel/${orderId}`);
            toast.success("Order cancelled!");
            loadOrders();
        } catch (err) {
            toast.error("Could not cancel order.");
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    return (
        <>
            <Container className="history-container mt-4 pt-5">
                <h2 className="fw-bold mb-4">My Orders</h2>

                {orders.length === 0 && (
                    <p className="text-muted text-center">No orders found</p>
                )}

                {orders.map((order) => (
                    <OrderCard
                        key={order._id}
                        order={order}
                        onCancelOrder={(id) => cancelOrder(id)}
                    />
                ))}

            </Container>
        </>
    );
};

export default OrderHistoryPage;
