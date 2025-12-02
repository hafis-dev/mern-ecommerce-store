import { createContext, useState } from "react";
import api from "../services/api/axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {

    const [products, setProducts] = useState([]);
    // SINGLE PRODUCT
    const [singleProduct, setSingleProduct] = useState(null);
    // ----------------------
    // ALL ORDERS
    const [orders, setOrders] = useState([]);







    // LOAD ALL PRODUCTS
    // ----------------------
    const loadProducts = async () => {
        try {
            const res = await api.get("/products");
            setProducts(res.data.products);
        } catch (err) {
            toast.error("Failed to load products");
        }
    };

    // ----------------------
    // DELETE PRODUCT
    // ----------------------
    const deleteProduct = async (id) => {
        if (!window.confirm("Delete this product?")) return;

        try {
            await api.delete(`/products/${id}`);
            toast.success("Product deleted");
            loadProducts();
        } catch (err) {
            toast.error("Failed to delete");
        }
    };



    // LOAD SINGLE PRODUCT (for editing)
    const loadSingleProduct = async (id) => {
        try {
            const res = await api.get(`/products/${id}`);
            setSingleProduct(res.data.product);
            return res.data.product;
        } catch (err) {
            toast.error("Failed to load product");
        }
    };

    // UPDATE PRODUCT
    const updateProduct = async (id, formData) => {
        try {
            await api.put(`/products/${id}`, formData);
            toast.success("Product updated successfully!");
            return true;
        } catch (err) {
            toast.error("Failed to update product");
            return false;
        }
    };

    
    // LOAD ALL ORDERS
    const loadAllOrders = async () => {
        try {
            const res = await api.get("/orders");     // or /orders/all
            setOrders(res.data);
            return true;
        } catch (err) {
            toast.error("Failed to load orders");
            return false;
        }
    };

    // UPDATE ORDER STATUS
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/status/${orderId}`, { status: newStatus });
            toast.success("Status updated!");
            loadAllOrders();
            return true;
        } catch (err) {
            toast.error("Failed to update status");
            return false;
        }
    };

    return (
        <AdminContext.Provider value={{
            products,
            loadProducts,
            deleteProduct,

            singleProduct,
            loadSingleProduct,
            updateProduct,
            orders,
            loadAllOrders,
            updateOrderStatus
        }}>
            {children}
        </AdminContext.Provider>
    );
};


