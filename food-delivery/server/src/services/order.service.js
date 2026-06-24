import prisma from "../config/db.js";

const createOrder = async ({ customer_name, address, phone, items }) => {
  const menuItemIds = [...new Set(items.map((i) => i.menu_item_id))];
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds }, is_available: true },
    select: { id: true, price: true },
  });

  if (menuItems.length !== menuItemIds.length) {
    const err = new Error("One or more menu items are unavailable or do not exist");
    err.statusCode = 400;
    throw err;
  }

  const priceMap = Object.fromEntries(menuItems.map((m) => [m.id, parseFloat(m.price)]));

  const total_amount = items.reduce((sum, item) => {
    return sum + priceMap[item.menu_item_id] * item.quantity;
  }, 0);

  return prisma.$transaction(async (tx) => {
    return tx.order.create({
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
      select: {
        id: true,
        customer_name: true,
        address: true,
        phone: true,
        status: true,
        total_amount: true,
        createdAt: true,
        orderItems: {
          select: {
            id: true,
            menu_item_id: true,
            quantity: true,
            unit_price: true,
          },
        },
      },
    });
  });
};

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

const getAllOrders = async () => {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { orderItems: true },
  });
};

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

export { createOrder, getOrderById, getAllOrders, updateOrderStatus, cancelOrder };
export default { createOrder, getOrderById, getAllOrders, updateOrderStatus, cancelOrder };
