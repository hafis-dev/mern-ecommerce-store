import { createContext, useState } from "react";
import { toast } from "react-toastify";
import { getAllOrders } from "../services/api/order.service";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {

    
    const [orders, setOrders] = useState([]);

    const loadAllOrders = async () => {
        try {
            const res = await getAllOrders();
            setOrders(res.data);
            return res.data; 
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


