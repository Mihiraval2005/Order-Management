const registerOrderSockets = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on("join_order", (orderId) => {
      const room = `order_${orderId}`;
      socket.join(room);
      console.log(`📦 Socket ${socket.id} joined room: ${room}`);
      socket.emit("joined", { orderId, message: `Tracking order #${orderId}` });
    });

    socket.on("leave_order", (orderId) => {
      socket.leave(`order_${orderId}`);
      console.log(`👋 Socket ${socket.id} left room: order_${orderId}`);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
};

export { registerOrderSockets };
