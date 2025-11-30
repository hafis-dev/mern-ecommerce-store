import { useContext, useEffect } from "react";
import { CartContext } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";
import CartCard from "./CartCard";
import { Card, Button, Container } from "react-bootstrap";
import styles from "./cartPage.module.css";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, loadCart, updateCartItem, removeItem, cartCount } =
    useContext(CartContext);

  useEffect(() => {
    loadCart();
  }, []);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <Container className={`${styles.cartContainer} pt-5 mt-lg-0 mt-md-4 mt-sm-3`}>
      <h2 className={`${styles.cartTitle} mt-4`}>Your Cart ({cartCount})</h2>

      {cart.length === 0 && (
        <h3 className={styles.emptyText}>No items in cart</h3>
      )}

      {cart.map((item, index) => (
        <CartCard
          key={index}
          item={item}
          onClick={() => navigate(`/product/${item.product._id}`)}
          onIncrease={(e) => {
            e.stopPropagation();
            updateCartItem(item.product._id, item.quantity + 1);
          }}
          onDecrease={(e) => {
            e.stopPropagation();
            updateCartItem(item.product._id, item.quantity - 1);
          }}
          onRemove={(e) => {
            e.stopPropagation();
            removeItem(item.product._id);
          }}
        />
      ))}

      {cart.length > 0 && (
        <Card className={styles.totalCard}>
          <h3 className={styles.totalText}>Total Amount: ₹{totalAmount}</h3>

          <Button
            className={styles.checkoutBtn}
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </Button>
        </Card>
      )}
    </Container>
  );
};

export default CartPage;
