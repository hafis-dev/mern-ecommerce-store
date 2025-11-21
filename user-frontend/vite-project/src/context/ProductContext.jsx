import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [featured, setFeatured] = useState([]);
  const [newArrival, setNewArrival] = useState([]);
  const [products, setProducts] = useState([]);
  // Fetch Featured products
  const loadFeatured = async () => {
    const res = await api.get("/products/featured");
    setFeatured(res.data.products || res.data);
  };

async function loadAllProducts(filters={}){
  try {
    const res = await api.get('/products',{params:filters});
    setProducts(res.data.products || res.data);
  } catch (error) {
    console.log("Failed to load products")
  }
}
  // Fetch New Arrival products
  const loadNewArrival = async () => {
    const res = await api.get("/products/new");
    setNewArrival(res.data.products || res.data);
  };

  useEffect(() => {
    loadFeatured();
    loadNewArrival();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        featured,
        newArrival,
        loadAllProducts,
        loadFeatured,
        loadNewArrival,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
