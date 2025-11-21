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

function App() {
  return (
    <BrowserRouter>
    <AppNavbar/>
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

      </Routes>
    </BrowserRouter>
  )
}

export default App