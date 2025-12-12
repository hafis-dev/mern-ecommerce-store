import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import OrderCard from "./OrderCard";
import { toast } from "react-toastify";
import { cancelOrder, getMyOrders } from "../../../services/api/order.service";

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);

    const loadOrders = async () => {
        try {
            const res = await getMyOrders()
            setOrders(res.data);
        } catch (err) {
            console.log("Order history error:", err);
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

    return (
        <>
            <Container className="history-container mt-4 pt-5" style={{ minHeight: "85vh" }}>
                <h2 className=" text-center mb-4" style={{
                    color: "var(--c6)"
                }}>My Orders</h2>

                {orders.length === 0 && (

                    <p className="text-muted text-center" style={{
                        color: "var(--c4)",

                        fontSize: "18px"
                    }}>No orders found</p>
                )}

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
