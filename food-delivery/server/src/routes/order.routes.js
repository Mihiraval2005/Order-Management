const express = require("express");
const router = express.Router();
const { placeOrder, getOrder, getOrders, updateStatus, cancelOrder } = require("../controllers/order.controller");
const validate = require("../middleware/validate");
const { createOrderSchema, updateStatusSchema } = require("../schemas/order.schema");

// POST /api/orders
router.post("/", validate(createOrderSchema), placeOrder);

// GET /api/orders
router.get("/", getOrders);

// GET /api/orders/:id
router.get("/:id", getOrder);

// PATCH /api/orders/:id/status
router.patch("/:id/status", validate(updateStatusSchema), updateStatus);

// DELETE /api/orders/:id  (cancel)
router.delete("/:id", cancelOrder);

module.exports = router;
