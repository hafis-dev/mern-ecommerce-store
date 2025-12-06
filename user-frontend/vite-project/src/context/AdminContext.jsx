import { createContext, useState } from "react";
import api from "../services/api/axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {

    // ----------------------
    // ALL ORDERS
    const [orders, setOrders] = useState([]);

    const loadAllOrders = async () => {
        try {
            const res = await api.get("/orders");
            setOrders(res.data);
            return res.data; // ✅ return actual orders
        } catch (err) {
            console.log(err)
            toast.error("Failed to load orders");
            return [];
        }
    };

    const toggleOrderOpen = (index) => {
        setOrders(prev =>
            prev.map((o, i) =>
                i === index ? { ...o, open: !o.open } : { ...o }
            )
        );
    };

    

    return (
        <AdminContext.Provider value={{
            orders,
            loadAllOrders,
            toggleOrderOpen
        }}>
            {children}
        </AdminContext.Provider>
    );
};


