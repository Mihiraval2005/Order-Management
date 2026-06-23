const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  // Prisma known errors
  if (err.code === "P2025") {
    return res.status(404).json({ success: false, message: "Record not found" });
  }
  if (err.code === "P2003") {
    return res.status(400).json({ success: false, message: "Invalid reference — item does not exist" });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
