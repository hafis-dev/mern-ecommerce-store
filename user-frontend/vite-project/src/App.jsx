import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import LoginPage from './pages/LoginPage'
import HomePage from './pages/user/Home/HomePage'
import SignupPage from './pages/user/Authentication/SignupPage'
import ForgotPasswordPage from './pages/user/Authentication/ForgotPasswordPage'
import ResetPasswordPage from './pages/user/Authentication/ResetPasswordPage'
import CollectionPage from './pages/user/Collection/CollectionPage'
import AppNavbar from './components/AppNavbar'
import AdminNavbar from './components/AdminNavbar'
import CartPage from './pages/user/Cart/CartPage'
import ProductPage from './pages/user/Product/ProductPage'
import ProtectRoute from './routes/ProtectRoute'
import CheckoutPage from './pages/user/Checkout/CheckoutPage'
import OrderHistoryPage from './pages/user/Orders/OrderHistoryPage'
import { Container } from 'react-bootstrap'
import Footer from './components/Footer'
import AboutPage from './pages/user/About/AboutPage'
import ScrollToTop from './routes/ScrollToTop'
import OrderSuccessPage from './pages/user/Orders/OrderSuccessPage'

import ProductAddpage from './pages/admin/ProductAddpage'
import AdminProtectRoute from './routes/AdminProtectRoute'
import ProductListPage from './pages/admin/ProductListPage'
import ProductEditpage from './pages/admin/ProductEditpage'
import OrderListPage from './pages/admin/OrderListPage'
import DashBoard from './pages/admin/DashBoard'
import AdminFooter from './components/AdminFooter';

function App() {

  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <ScrollToTop />

      {/* 🔥 AUTO SWITCH NAVBAR HERE */}
      {user?.isAdmin ? <AdminNavbar /> : <AppNavbar />}

      <Container className="px-0 mt-5 pt-3">
        <Routes>
          <Route path='/' element={< HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/products" element={< CollectionPage />} />

          <Route
            path="/cart"
            element={<ProtectRoute><CartPage /></ProtectRoute>}
          />

          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* ADMIN ROUTES */}
          <Route
            path="/admin/product-add"
            element={<AdminProtectRoute><ProductAddpage /></AdminProtectRoute>}
          />

          <Route
            path="/admin/products"
            element={<AdminProtectRoute><ProductListPage /></AdminProtectRoute>}
          />

          <Route
            path="/admin/products/edit/:id"
            element={<AdminProtectRoute><ProductEditpage /></AdminProtectRoute>}
          />

          <Route
            path="/admin/orders"
            element={<AdminProtectRoute><OrderListPage /></AdminProtectRoute>}
          />

          <Route
            path="/admin/dashboard"
            element={<AdminProtectRoute><DashBoard /></AdminProtectRoute>}
          />

        </Routes>
      </Container>
      {user?.isAdmin ? <AdminFooter /> : <Footer />}

    </BrowserRouter>
  );
}

export default App;
