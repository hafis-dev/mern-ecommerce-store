import { useContext, useEffect } from "react";
import { CartContext } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";
import CartCard from "./CartCard";
import { Card, Button, Container } from "react-bootstrap";
import styles from "./cartPage.module.css";
import { removeFromCart, updateCartQuantity } from "../../../services/api/cart.service.js";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, loadCart, setCart, cartCount } = useContext(CartContext);

  useEffect(() => {
    loadCart();
  }, []);

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const handleQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      const res = await updateCartQuantity(productId, quantity);
      setCart(res.data.cart.items || []);
    } catch (err) {
      console.log("update error:", err);
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await removeFromCart(productId);
      setCart(res.data.cart.items || []);
      loadCart();
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

      {cart.map((item) =>
        item.product ? (
          <CartCard
            key={item.product._id}
            item={item}
            onClick={() => navigate(`/product/${item.product._id}`)}
            onIncrease={(e) => {
              e.stopPropagation();
              handleQuantity(item.product._id, item.quantity + 1);
            }}
            onDecrease={(e) => {
              e.stopPropagation();
              if (item.quantity > 1) {
                handleQuantity(item.product._id, item.quantity - 1);
              }
            }}
            onRemove={(e) => {
              e.stopPropagation();
              removeItem(item.product._id);
            }}
          />
        ) : null
      )}

      {cart.length > 0 && (
        <Card className={styles.totalCard}>
          <h3 className={styles.totalText}>
            Total Amount: ₹{totalAmount.toLocaleString()}
          </h3>

          <Button
            className={styles.checkoutBtn}
            onClick={() => navigate("/checkout")}
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
