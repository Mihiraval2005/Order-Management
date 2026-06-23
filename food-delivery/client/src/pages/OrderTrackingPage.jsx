import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOrder } from "../services/api";
import StatusStepper from "../components/OrderStatus/StatusStepper";
import useOrderSocket from "../hooks/useOrderSocket";

const OrderTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time status from socket
  const { status, connected } = useOrderSocket(
    order ? parseInt(id) : null,
    order?.status
  );

  useEffect(() => {
    fetchOrder(id)
      .then(setOrder)
      .catch(() => setError("Order not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page page--center loader">Loading order...</div>;
  if (error) return (
    <div className="page page--center">
      <p className="error">{error}</p>
      <button className="btn btn--primary" onClick={() => navigate("/")}>Back to Menu</button>
    </div>
  );

  return (
    <div className="page">
      <header className="header">
        <button className="btn btn--ghost" onClick={() => navigate("/")}>← New Order</button>
        <div className="header__brand">🍕 QuickBite</div>
        <div className="socket-status">
          <span className={`socket-dot ${connected ? "socket-dot--on" : "socket-dot--off"}`} />
          {connected ? "Live" : "Connecting..."}
        </div>
      </header>

      <main className="tracking-page">
        <div className="tracking-card">
          <h1>Order #{order.id}</h1>
          <p className="tracking-subtitle">Placed by {order.customer_name}</p>
          <p className="tracking-address">📍 {order.address}</p>

          <StatusStepper status={status} />

          <div className="order-items-list">
            <h3>Items Ordered</h3>
            {order.orderItems.map((oi) => (
              <div key={oi.id} className="order-item-row">
                <span>{oi.menuItem.name} × {oi.quantity}</span>
                <span>₹{(parseFloat(oi.unit_price) * oi.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="order-total-row">
              <strong>Total</strong>
              <strong>₹{parseFloat(order.total_amount).toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderTrackingPage;
