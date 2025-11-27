import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [featured, setFeatured] = useState([]);
  const [newArrival, setNewArrival] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});   // 🌟 Dynamic filters

  // ======================
  // LOAD ALL PRODUCTS
  // ======================
  async function loadAllProducts(filters = {}) {
    try {
      const res = await api.get("/products", { params: filters });
      setProducts(res.data.products || res.data);
    } catch (error) {
      console.log("Failed to load products");
    }
  }

  // ======================
  // LOAD FEATURED
  // ======================
  const loadFeatured = async () => {
    const res = await api.get("/products/featured");
    setFeatured(res.data.products || res.data);
  };

  // ======================
  // LOAD NEW ARRIVAL
  // ======================
  const loadNewArrival = async () => {
    const res = await api.get("/products/new");
    setNewArrival(res.data.products || res.data);
  };

  // ======================
  // 🌟 NEW — LOAD DYNAMIC FILTERS
  // ======================
  const loadFilters = async () => {
    try {
      const res = await api.get("/products/filters");
      setFilters(res.data);
    } catch (error) {
      console.log("Failed to load filters");
    }
  };

  // ======================
  // INITIAL LOAD
  // ======================
  useEffect(() => {
    loadFeatured();
    loadNewArrival();
    loadFilters();   // load filters on app start
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        featured,
        newArrival,
        filters,          // 🌟 returned to frontend
        loadAllProducts,
        loadFeatured,
        loadNewArrival,
        loadFilters,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
