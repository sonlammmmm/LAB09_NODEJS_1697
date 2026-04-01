const Product = require("../models/product.model");

// GET /api/products - Get all products
const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id - Get product by ID
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// POST /api/products - Create product (inventory auto-created via post hook)
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category } = req.body;
    const product = await Product.create({ name, description, price, category });
    res.status(201).json({
      success: true,
      message: "Tạo sản phẩm thành công. Tồn kho được khởi tạo tự động.",
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllProducts, getProductById, createProduct };
