import { useCart } from "../../context/CartContext";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";

const Cart = ({ onClose }) => {
  const { cart, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose?.();
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="cart cart--empty">
        <h2>Your Cart</h2>
        <div className="cart__empty-msg">
          <span>🛒</span>
          <p>Your cart is empty</p>
          <p>Add items from the menu to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart__header">
        <h2>Your Cart <span className="cart__count">({totalItems})</span></h2>
        <button className="btn btn--ghost btn--sm" onClick={clearCart}>Clear all</button>
      </div>

      <div className="cart__items">
        {cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="cart__footer">
        <div className="cart__total">
          <span>Total</span>
          <span className="cart__total-price">₹{totalPrice.toFixed(2)}</span>
        </div>
        <button className="btn btn--primary btn--full" onClick={handleCheckout}>
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
};

export default Cart;
