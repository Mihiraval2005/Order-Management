const menuService = require("../services/menu.service");

const getMenu = async (req, res, next) => {
  try {
    const items = await menuService.getAllMenuItems();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

const getMenuItem = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    const item = await menuService.getMenuItemById(id);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMenu, getMenuItem };
