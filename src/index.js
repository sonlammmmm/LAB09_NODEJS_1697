require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const productRoutes = require("./routes/product.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/inventories", inventoryRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Inventory API is running 🚀" });
});

// Error handler (must be last)
app.use(errorHandler);

// Connect to MongoDB
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect('mongodb://localhost:27017/LAB07')
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });