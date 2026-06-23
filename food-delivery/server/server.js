require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const { registerOrderSockets } = require("./src/sockets/orderSocket");

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

// Attach Socket.io to the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Make io accessible in controllers via req.app.get('io')
app.set("io", io);

// Register socket handlers
registerOrderSockets(io);

httpServer.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io ready`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}\n`);
});
