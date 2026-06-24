import prisma from "../config/db.js";

const getAllMenuItems = async () => {
  return prisma.menuItem.findMany({
    where: { is_available: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
};

const getMenuItemById = async (id) => {
  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) {
    const err = new Error("Menu item not found");
    err.statusCode = 404;
    throw err;
  }
  return item;
};

export { getAllMenuItems, getMenuItemById };
export default { getAllMenuItems, getMenuItemById };
