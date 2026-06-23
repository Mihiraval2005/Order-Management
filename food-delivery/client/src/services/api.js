import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

// ─── Menu ────────────────────────────────────────────
export const fetchMenu = () => api.get("/menu").then((r) => r.data.data);
export const fetchMenuItem = (id) => api.get(`/menu/${id}`).then((r) => r.data.data);

// ─── Orders ──────────────────────────────────────────
export const placeOrder = (orderData) => api.post("/orders", orderData).then((r) => r.data);
export const fetchOrder = (id) => api.get(`/orders/${id}`).then((r) => r.data.data);
export const fetchAllOrders = () => api.get("/orders").then((r) => r.data.data);
export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, { status }).then((r) => r.data);

export default api;