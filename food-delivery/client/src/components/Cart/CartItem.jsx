import { useCart } from "../../context/CartContext";

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="cart-item">
      <img src={item.image_url} alt={item.name} className="cart-item__img" />
      <div className="cart-item__info">
        <p className="cart-item__name">{item.name}</p>
        <p className="cart-item__price">₹{parseFloat(item.price).toFixed(2)} each</p>
      </div>
      <div className="cart-item__controls">
        <button
          className="qty-btn"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          aria-label="Decrease quantity"
        >−</button>
        <span className="qty-value">{item.quantity}</span>
        <button
          className="qty-btn"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          aria-label="Increase quantity"
        >+</button>
      </div>
      <div className="cart-item__subtotal">
        ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
      </div>
      <button
        className="cart-item__remove"
        onClick={() => removeItem(item.id)}
        aria-label="Remove item"
      >×</button>
    </div>
  );
};

export default CartItem;
