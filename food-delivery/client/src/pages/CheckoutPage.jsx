import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CheckoutForm from "../components/Checkout/CheckoutForm";

const CheckoutPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="page page--center">
        <h2>Your cart is empty</h2>
        <button className="btn btn--primary" onClick={() => navigate("/")}>
          ← Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="header">
        <button className="btn btn--ghost" onClick={() => navigate("/")}>← Back to Menu</button>
        <div className="header__brand">🍕 QuickBite</div>
      </header>
      <main style={{ padding: "2rem 1rem" }}>
        <CheckoutForm />
      </main>
    </div>
  );
};

export default CheckoutPage;
