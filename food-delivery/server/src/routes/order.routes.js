import express from "express";
import { placeOrder, getOrder, getOrders, updateStatus, cancelOrder } from "../controllers/order.controller.js";
import validate from "../middleware/validate.js";
import { createOrderSchema, updateStatusSchema } from "../schemas/order.schema.js";

const router = express.Router();

router.post("/", validate(createOrderSchema), placeOrder);

router.get("/", getOrders);

router.get("/:id", getOrder);

router.patch("/:id/status", validate(updateStatusSchema), updateStatus);

router.delete("/:id", cancelOrder);

export default router;
