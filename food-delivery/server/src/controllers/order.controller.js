const orderService = require("../services/order.service");
const { simulateOrderProgress } = require("../services/statusSimulator.service");

// io is injected via req.app.get('io')
const placeOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.validatedData);
    const io = req.app.get("io");
    // Start real-time status simulation
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

    // Also emit socket event for manual status updates
    const io = req.app.get("io");
    io.to(`order_${id}`).emit("order_status_update", { orderId: id, status });

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

module.exports = { placeOrder, getOrder, getOrders, updateStatus, cancelOrder };
