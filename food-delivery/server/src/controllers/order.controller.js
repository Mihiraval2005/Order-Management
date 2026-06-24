import orderService from "../services/order.service.js";
import { simulateOrderProgress } from "../services/statusSimulator.service.js";

const placeOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.validatedData);
    const io = req.app.get("io");
    simulateOrderProgress(order.id, io);
    res.status(201).json({ success: true, message: "Order placed successfully", data: order });
  } catch (err) {
    next(err);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid order ID" });
    const order = await orderService.getOrderById(id);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid order ID" });
    const { status } = req.validatedData;
    const updated = await orderService.updateOrderStatus(id, status);

    const io = req.app.get("io");
    if (io?.to) {
      io.to(`order_${id}`).emit("order_status_update", { orderId: id, status });
    }

    res.json({ success: true, message: "Status updated", data: updated });
  } catch (err) {
    next(err);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid order ID" });
    const cancelled = await orderService.cancelOrder(id);
    res.json({ success: true, message: "Order cancelled", data: cancelled });
  } catch (err) {
    next(err);
  }
};

export { placeOrder, getOrder, getOrders, updateStatus, cancelOrder };
