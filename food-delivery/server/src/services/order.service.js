const prisma = require("../config/db");

/**
 * Create a new order.
 * Validates that all menu_item_ids exist, calculates total, creates order + items in one transaction.
 */
const createOrder = async ({ customer_name, address, phone, items }) => {
  // Fetch all menu items in one query
  const menuItemIds = items.map((i) => i.menu_item_id);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds }, is_available: true },
  });

  if (menuItems.length !== menuItemIds.length) {
    const err = new Error("One or more menu items are unavailable or do not exist");
    err.statusCode = 400;
    throw err;
  }

  // Build a lookup map for prices
  const priceMap = {};
  menuItems.forEach((m) => { priceMap[m.id] = parseFloat(m.price); });

  // Calculate total
  const total_amount = items.reduce((sum, item) => {
    return sum + priceMap[item.menu_item_id] * item.quantity;
  }, 0);

  // Create order + items in a transaction
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        customer_name,
        address,
        phone,
        total_amount,
        orderItems: {
          create: items.map((item) => ({
            menu_item_id: item.menu_item_id,
            quantity: item.quantity,
            unit_price: priceMap[item.menu_item_id],
          })),
        },
      },
      include: {
        orderItems: { include: { menuItem: true } },
      },
    });
    return newOrder;
  });

  return order;
};

/**
 * Get a single order with its items.
 */
const getOrderById = async (id) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: { menuItem: { select: { name: true, image_url: true, category: true } } },
      },
    },
  });
  if (!order) {
    const err = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }
  return order;
};

/**
 * Get all orders (most recent first).
 */
const getAllOrders = async () => {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { orderItems: true },
  });
};

/**
 * Update an order's status.
 */
const updateOrderStatus = async (id, status) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    const err = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }
  if (order.status === "cancelled") {
    const err = new Error("Cannot update status of a cancelled order");
    err.statusCode = 400;
    throw err;
  }
  return prisma.order.update({ where: { id }, data: { status } });
};

/**
 * Cancel an order (only if still in 'received' status).
 */
const cancelOrder = async (id) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    const err = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }
  if (order.status !== "received") {
    const err = new Error("Order can only be cancelled when in 'received' status");
    err.statusCode = 400;
    throw err;
  }
  return prisma.order.update({ where: { id }, data: { status: "cancelled" } });
};

module.exports = { createOrder, getOrderById, getAllOrders, updateOrderStatus, cancelOrder };
