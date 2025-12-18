import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.min.css";

import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/Cart/cart.provider.jsx';
import { AdminProvider } from './context/AdminContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { WishlistProvider } from './context/Wishlist/wishlist.provider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>

       
        <AdminProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AdminProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>

    <ToastContainer position="top-right" autoClose={3000} />
  </StrictMode>
);
