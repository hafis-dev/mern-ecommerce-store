import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api/axios";
import { toast } from "react-toastify";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [featured, setFeatured] = useState([]);
  const [newArrival, setNewArrival] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});

  // ======================
  // LOAD ALL PRODUCTS
  // ======================
  const loadAllProducts = useCallback(async (queryFilters = {}) => {
    try {
      const res = await api.get("/products", { params: queryFilters });
      setProducts(res.data.products || res.data);
    } catch (error) {
      console.log(error)
      toast.error("Failed to load products");
    }
  }, []);

  // ======================
  // LOAD FEATURED
  // ======================
  const loadFeatured = useCallback(async () => {
    try {
      const res = await api.get("/products/featured");
      setFeatured(res.data.products || res.data);
    } catch (error) {
      console.log(error)
      toast.error("Failed to load featured products");
    }
  }, []);

  // ======================
  // LOAD NEW ARRIVAL
  // ======================
  const loadNewArrival = useCallback(async () => {
    try {
      const res = await api.get("/products/new");
      setNewArrival(res.data.products || res.data);
    } catch (error) {
      console.log(error)
      toast.error("Failed to load new arrivals");
    }
  }, []);

  // ======================
  // LOAD FILTERS
  // ======================
  const loadFilters = useCallback(async () => {
    try {
      const res = await api.get("/products/filters");
      setFilters(res.data);
    } catch (error) {
      console.log(error)
      toast.error("Failed to load filters");
    }
  }, []);

  // ======================
  // INITIAL LOAD
  // ======================
  useEffect(() => {
    loadFeatured();
    loadNewArrival();
    loadFilters();
  }, [loadFeatured, loadNewArrival, loadFilters]);

  return (
    <ProductContext.Provider
      value={{
        products,
        featured,
        newArrival,
        filters,
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
