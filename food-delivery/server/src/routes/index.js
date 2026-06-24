import express from "express";
import menuRoutes from "./menu.routes.js";
import orderRoutes from "./order.routes.js";

const router = express.Router();

router.use("/menu", menuRoutes);
router.use("/orders", orderRoutes);

router.get("/health", (req, res) => {
  res.json({ success: true, message: "API is running", timestamp: new Date().toISOString() });
});

export default router;
