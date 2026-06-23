const { updateOrderStatus } = require("./order.service");

const STATUS_SEQUENCE = ["received", "preparing", "out_for_delivery", "delivered"];
// Delays in milliseconds between each status transition
const DELAYS = [10000, 20000, 30000]; // 10s → 20s → 30s

/**
 * Automatically advances an order through all statuses and emits socket events.
 * Called after a new order is placed.
 *
 * @param {number} orderId
 * @param {object} io - Socket.io server instance
 */
const simulateOrderProgress = (orderId, io) => {
  let stepIndex = 1; // start from 'preparing' (order starts as 'received')

  const advance = async () => {
    if (stepIndex >= STATUS_SEQUENCE.length) return;

    const newStatus = STATUS_SEQUENCE[stepIndex];

    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      console.log(`🚀 Order #${orderId} → ${newStatus}`);

      // Emit to all clients in the order's room
      io.to(`order_${orderId}`).emit("order_status_update", {
        orderId,
        status: newStatus,
        updatedAt: updated.createdAt,
      });

      stepIndex++;
      if (stepIndex < STATUS_SEQUENCE.length) {
        setTimeout(advance, DELAYS[stepIndex - 1] || 20000);
      }
    } catch (err) {
      console.error(`❌ Status simulation failed for order #${orderId}:`, err.message);
    }
  };

  // Start the chain after first delay
  setTimeout(advance, DELAYS[0]);
};

module.exports = { simulateOrderProgress };
