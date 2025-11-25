import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import CollectionPage from './pages/CollectionPage'
import AppNavbar from './components/AppNavbar'
import CartPage from './pages/CartPage'
import ProductPage from './pages/ProductPage'
import ProtectRoute from './routes/ProtectRoute'
import CheckoutPage from './pages/CheckoutPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import { Container } from 'react-bootstrap'
import Footer from './components/Footer'
import AboutPage from './pages/AboutPage'
import ScrollToTop from './routes/ScrollToTop'
import OrderSuccessPage from './pages/OrderSuccessPage'

function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
      <AppNavbar />
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
          element={
            <ProtectRoute>
              <CartPage />
            </ProtectRoute>
          }
        />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={ <OrderSuccessPage/> } />
        <Route path="/orders" element={<OrderHistoryPage />} />
<Route path="/about" element={<AboutPage/> }/>
      </Routes>
      
      </Container>
      <Footer />
    </BrowserRouter>
  )
}

export default App