import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api/axios";
import { toast } from "react-toastify";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [filters, setFilters] = useState({});

  

  // Load filters for sidebar
  const loadFilters = useCallback(async () => {
    try {
      const res = await api.get("/products/filters");
      setFilters(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load filters");
    }
  }, []);

  useEffect(() => {
    loadFilters();
  }, [loadFilters]);

  return (
    <ProductContext.Provider
      value={{
        filters,
        loadFilters,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
