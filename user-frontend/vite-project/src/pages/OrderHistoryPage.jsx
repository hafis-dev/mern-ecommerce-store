import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Image, Container } from "react-bootstrap";
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
    const cancelItem = async (orderId, itemId) => {
        try {
            await api.put(`/orders/cancel-item/${orderId}/${itemId}`);
            toast.success("Item cancelled!");
            loadOrders();
        } catch (err) {
            toast.error("Could not cancel item.");
        }
    };


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
            {/* ⭐ CSS */}
            <style>{`
                .history-container {
                    padding: 25px 20px;
                    background: #fafafb;
                    min-height: 100vh;
                }

                .order-card {
                    background: #ffffff;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 3px 12px rgba(0,0,0,0.08)
                    margin-bottom: 25px;
                }

                .order-header {
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 5px;
                }

                .order-meta {
                    color: #908681;
                    font-size: 14px;
                    margin-bottom: 10px;
                }

                .item-row {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 10px 0;
                    border-bottom: 1px solid #e6e6e6;
                }

                .item-img {
                    width: 70px;
                    height: 70px;
                    object-fit: cover;
                    border-radius: 8px;
                }

                .item-name {
                    font-size: 16px;
                    font-weight: 600;
                }

                .status-badge {
                    padding: 5px 12px;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 600;
                    display: inline-block;
                    margin-top: 8px;
                }

                .status-processing {
                    background: #fff4cc;
                    color: #8a6d1a;
                }

                .status-delivered {
                    background: #d4ffd9;
                    color: #237a32;
                }

                .status-cancelled {
                    background: #ffd4d4;
                    color: #9e1b1b;
                }

                .btn-view {
                    margin-left: 10px;
                }

                .btn-cancel {
                    background: #6d5a4e !important;
                    border: none;
                }

                .btn-cancel:hover {
                    background: #908681 !important;
                }

                .btn-view {
                    background: #dbd9d9 !important;
                    color: #1b1a19 !important;
                    border: none;
                }

                .btn-view:hover {
                    background: #beb7b3 !important;
                }
            `}</style>

            <Container className="history-container  mt-4 pt-5 mt-lg-0 mt-md-4 mt-sm-3">
                <h2 className="fw-bold mb-4">My Orders</h2>

                {orders.length === 0 && (
                    <p className="text-muted text-center">No orders found</p>
                )}

                {orders.map((order) => (
                    <OrderCard
                        key={order._id}
                        order={order}
                        onCancelOrder={(id) => cancelOrder(id)}
                        onCancelItem={(orderId, itemId) => cancelItem(orderId, itemId)}
                    />

                   
                ))}

            </Container>
        </>
    );
};

export default OrderHistoryPage;
