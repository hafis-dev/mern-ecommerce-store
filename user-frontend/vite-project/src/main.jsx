import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.min.css";

import { ProductProvider } from './context/ProductContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AdminProvider } from './context/AdminContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>


        <ProductProvider>
          <AdminProvider>

             <App />
          </AdminProvider>
         
        </ProductProvider>
      </CartProvider>
    </AuthProvider>


    <ToastContainer position="top-right" autoClose={3000} />
  </StrictMode>,
)
