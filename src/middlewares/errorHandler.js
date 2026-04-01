const errorHandler = (err, req, res, next) => {
  // Custom thrown errors with status
  if (err.status) {
    return res.status(err.status).json({ success: false, message: err.message });
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(", ") });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `Duplicate value for field: ${field}`,
    });
  }

  // Fallback
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
};

module.exports = errorHandler;