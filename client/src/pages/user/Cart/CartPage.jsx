import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartCard from "./CartCard";
import { Card, Container } from "react-bootstrap";
import styles from "./cartPage.module.css";
import { useCart } from "../../../context/Cart/useCart";

const CartPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const {
    cart,
    loadCart,
    updateQty,
    removeItem,
  } = useCart();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      await loadCart();
      setLoading(false);
    };

    fetchCart();
  }, []);


  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "85vh" }}
      >
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  if (cart.length === 0){
    return (
      <div className={styles.empty}>
        <h3>Your cart is empty 🛒</h3>
        <p>Add items to your cart to see them here.</p>
      </div>
    )
  }
  return (
    <Container className={`${styles.cartContainer}  mt-lg-0 mt-md-4 mt-sm-3`}>
      

     
      {cart.map(
        (item) =>
          item.product && (
            <CartCard
              key={item.product._id}
              item={item}
              onClick={() => navigate(`/product/${item.product._id}`)}
              onIncrease={(e) => {
                e.stopPropagation();
                updateQty(item.product._id, item.quantity + 1);
              }}
              onDecrease={(e) => {
                e.stopPropagation();
                updateQty(item.product._id, item.quantity - 1);
              }}
              onRemove={(e) => {
                e.stopPropagation();
                removeItem(item.product._id);
              }}
            />
          )
      )}

      {cart.length > 0 && (
        <Card className={styles.totalCard}>
          <h3 className={styles.totalText}>
            Total Amount: ₹{totalAmount.toLocaleString()}
          </h3>

          <button
            className={styles.checkoutBtn}
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </Card>
      )}
    </Container>
  );
};

export default CartPage;
