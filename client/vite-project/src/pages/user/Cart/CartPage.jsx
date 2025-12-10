import { useContext, useEffect } from "react";
import { CartContext } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";
import CartCard from "./CartCard";
import { Card, Button, Container } from "react-bootstrap";
import styles from "./cartPage.module.css";
import api from '../../../services/api/axios.js'

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, loadCart, setCart, cartCount } = useContext(CartContext);

  // FIX 1: Added [] to run only once on mount
  useEffect(() => {
    loadCart();
  }, []);

  // FIX 2: Safety Check for Total Calculation
  // If product is deleted (null), treat price as 0 so page doesn't crash
  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  // ==========================
  // UPDATE ITEM
  // ==========================
  const updateCartItem = async (productId, quantity) => {
    // FIX 3: Prevent quantity from going below 1 (or handle removal)
    if (quantity < 1) return;

    try {
      const res = await api.put("/cart/update", { productId, quantity });
      setCart(res.data.cart.items || []);
    } catch (err) {
      console.log("update error:", err);
    }
  };

  // ==========================
  // REMOVE ITEM
  // ==========================
  const removeItem = async (productId) => {
    try {
      const res = await api.delete(`/cart/remove/${productId}`);
      setCart(res.data.cart.items || []);
      loadCart()
    } catch (err) {
      console.log("remove error:", err);
    }
  };

  return (
    <Container className={`${styles.cartContainer} pt-5 mt-lg-0 mt-md-4 mt-sm-3`}>
      <h2 className={`${styles.cartTitle} mt-4`}>Your Cart ({cartCount})</h2>

      {cart.length === 0 && (
        <h3 className={styles.emptyText}>No items in cart</h3>
      )}

      {cart.map((item) => (
        // FIX 2 (Visual): Check if product exists before rendering
        item.product ? (
          <CartCard
            // FIX 4: Use unique ID instead of index
            key={item.product._id}
            item={item}
            onClick={() => navigate(`/product/${item.product._id}`)}
            onIncrease={(e) => {
              e.stopPropagation();
              updateCartItem(item.product._id, item.quantity + 1);
            }}
            onDecrease={(e) => {
              e.stopPropagation();
              // Logic: If quantity is 1, hitting minus does nothing
              if (item.quantity > 1) {
                updateCartItem(item.product._id, item.quantity - 1);
              }
            }}
            onRemove={(e) => {
              e.stopPropagation();
              removeItem(item.product._id);
            }}
          />
        ) : null
      ))}

      {cart.length > 0 && (
        <Card className={styles.totalCard}>
          {/* Added toLocaleString for better currency formatting */}
          <h3 className={styles.totalText}>Total Amount: ₹{totalAmount.toLocaleString()}</h3>

          <Button
            className={styles.checkoutBtn}
            onClick={() => navigate("/checkout")}
            // Good practice: Disable checkout if total is 0
            disabled={totalAmount === 0}
          >
            Proceed to Checkout
          </Button>
        </Card>
      )}
    </Container>
  );
};

export default CartPage;