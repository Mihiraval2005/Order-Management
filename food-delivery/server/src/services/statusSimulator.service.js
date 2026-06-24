import { updateOrderStatus } from "./order.service.js";

const STATUS_SEQUENCE = ["received", "preparing", "out_for_delivery", "delivered"];
const DELAYS = [10000, 20000, 30000];

const simulateOrderProgress = (orderId, io) => {
  let stepIndex = 1;

  const advance = async () => {
    if (stepIndex >= STATUS_SEQUENCE.length) return;

    const newStatus = STATUS_SEQUENCE[stepIndex];

    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      console.log(`🚀 Order #${orderId} → ${newStatus}`);

      if (io?.to) {
        io.to(`order_${orderId}`).emit("order_status_update", {
          orderId,
          status: newStatus,
          updatedAt: updated.createdAt,
        });
      }

      stepIndex++;
      if (stepIndex < STATUS_SEQUENCE.length) {
        setTimeout(advance, DELAYS[stepIndex - 1] || 20000);
      }
    } catch (err) {
      console.error(`❌ Status simulation failed for order #${orderId}:`, err.message);
    }
  };

  setTimeout(advance, DELAYS[0]);
};

export { simulateOrderProgress };
