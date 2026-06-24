import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { placeOrder } from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CheckoutForm = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ customer_name: "", address: "", phone: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.customer_name.trim() || form.customer_name.trim().length < 2)
      errs.customer_name = "Name must be at least 2 characters";
    if (!form.address.trim() || form.address.trim().length < 10)
      errs.address = "Please enter a valid address (min 10 chars)";
    if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone))
      errs.phone = "Enter a valid phone number";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);

    setLoading(true);
    try {
      const orderPayload = {
        ...form,
        items: cart.map((i) => ({ menu_item_id: i.id, quantity: i.quantity })),
      };
      const result = await placeOrder(orderPayload);
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/track/${result.data.id}`);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to place order";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout">
      <div className="checkout__form-wrap">
        <h2>Delivery Details</h2>
        <form onSubmit={handleSubmit} className="checkout__form" noValidate>
          <div className="form-group">
            <label htmlFor="customer_name">Full Name</label>
            <input
              id="customer_name"
              name="customer_name"
              type="text"
              placeholder="e.g. Mihir Shah"
              value={form.customer_name}
              onChange={handleChange}
              className={errors.customer_name ? "input--error" : ""}
            />
            {errors.customer_name && <span className="field-error">{errors.customer_name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Delivery Address</label>
            <textarea
              id="address"
              name="address"
              rows={3}
              placeholder="Full address with city and pincode"
              value={form.address}
              onChange={handleChange}
              className={errors.address ? "input--error" : ""}
            />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="e.g. 9876543210"
              value={form.phone}
              onChange={handleChange}
              className={errors.phone ? "input--error" : ""}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? "Placing Order..." : `Place Order · ₹${totalPrice.toFixed(2)}`}
          </button>
        </form>
      </div>

      <div className="checkout__summary">
        <h3>Order Summary</h3>
        {cart.map((item) => (
          <div key={item.id} className="summary-item">
            <span>{item.name} × {item.quantity}</span>
            <span>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="summary-total">
          <strong>Total</strong>
          <strong>₹{totalPrice.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
