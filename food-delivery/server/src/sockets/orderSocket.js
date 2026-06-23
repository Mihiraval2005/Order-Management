/**
 * Socket.io event handlers for order tracking.
 * Clients join a room named "order_{id}" to receive real-time status updates.
 */
const registerOrderSockets = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Client joins a specific order room to track it
    socket.on("join_order", (orderId) => {
      const room = `order_${orderId}`;
      socket.join(room);
      console.log(`📦 Socket ${socket.id} joined room: ${room}`);
      socket.emit("joined", { orderId, message: `Tracking order #${orderId}` });
    });

    // Client leaves an order room
    socket.on("leave_order", (orderId) => {
      socket.leave(`order_${orderId}`);
      console.log(`👋 Socket ${socket.id} left room: order_${orderId}`);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = { registerOrderSockets };
