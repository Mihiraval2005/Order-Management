const express = require("express");
const router = express.Router();
const { getMenu, getMenuItem } = require("../controllers/menu.controller");

// GET /api/menu
router.get("/", getMenu);

// GET /api/menu/:id
router.get("/:id", getMenuItem);

module.exports = router;
