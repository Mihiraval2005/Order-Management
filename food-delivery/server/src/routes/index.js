const express = require("express");
const router = express.Router();

router.use("/menu", require("./menu.routes"));
router.use("/orders", require("./order.routes"));

// Health check
router.get("/health", (req, res) => {
  res.json({ success: true, message: "API is running", timestamp: new Date().toISOString() });
});

module.exports = router;
