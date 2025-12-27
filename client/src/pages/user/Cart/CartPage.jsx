import { useNavigate } from "react-router-dom";
import CartCard from "./CartCard";
import { Card, Container, Spinner } from "react-bootstrap";
import styles from "./cartPage.module.css";
import { useCart } from "../../../context/Cart/useCart";
import { useEffect } from "react";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQty,loadCart, removeItem, loading,updatingId } = useCart();
useEffect(()=>{
  loadCart()
},[])
  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  // 1. Show global loading state first
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
        <Spinner animation="border" />
      </div>
    );
  }

  // 2. Once loading is false, check if cart is empty
  if (cart.length === 0) {
    return (
      <div className={styles.empty}>
        <h3>Your cart is empty 🛒</h3>
        <p>Add items to your cart to see them here.</p>
      </div>
    );
  }

  // 3. Render the cart
  return (
    <Container className={`${styles.cartContainer} mt-lg-0 mt-md-4 mt-sm-3`}>
      {cart.map((item) => (
        item.product && (
          <CartCard
            key={item.product._id}
            item={item}
            isUpdating={updatingId === item.product._id}
            
            onIncrease={(e) => { e.stopPropagation(); updateQty(item.product._id, item.quantity + 1); }}
            onDecrease={(e) => { e.stopPropagation(); updateQty(item.product._id, item.quantity - 1); }}
            onRemove={(e) => { e.stopPropagation(); removeItem(item.product._id); }}
          />
        )
      ))}

      <Card className={styles.totalCard}>
        <h3 className={styles.totalText}>
          Total Amount: ₹{totalAmount.toLocaleString()}
        </h3>
        <button className={styles.checkoutBtn} onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </button>
      </Card>
    </Container>
  );
};

export default CartPage;