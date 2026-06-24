import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

let socket = null;

const useOrderSocket = (orderId, initialStatus = "received") => {
  const [status, setStatus] = useState(initialStatus);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    if (!socket) {
      socket = io(SOCKET_URL, { transports: ["websocket"] });
    }

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.emit("join_order", orderId);

    socket.on("order_status_update", (data) => {
      if (data.orderId === orderId) {
        setStatus(data.status);
      }
    });

    return () => {
      socket.emit("leave_order", orderId);
      socket.off("order_status_update");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [orderId]);

  return { status, connected };
};

export default useOrderSocket;
