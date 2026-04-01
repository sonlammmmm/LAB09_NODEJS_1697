const Inventory = require("../models/inventory.model");

// ─── Helper: find inventory by product ID ──────────────────────────────────
const findInventory = async (productId) => {
  const inv = await Inventory.findOne({ product: productId }).populate("product");
  if (!inv) throw { status: 404, message: "Không tìm thấy tồn kho cho sản phẩm này" };
  return inv;
};

// ─── Helper: validate quantity ─────────────────────────────────────────────
const validateQty = (quantity) => {
  if (!quantity || typeof quantity !== "number" || quantity <= 0 || !Number.isInteger(quantity)) {
    throw { status: 400, message: "Số lượng phải là số nguyên dương" };
  }
};

// GET /api/inventory - Get all inventories (joined with product)
const getAllInventory = async (req, res, next) => {
  try {
    const inventories = await Inventory.find()
      .populate("product")
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      count: inventories.length,
      data: inventories,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/inventory/:id - Get inventory by ID (joined with product)
const getInventoryById = async (req, res, next) => {
  try {
    const inventory = await Inventory.findById(req.params.id).populate("product");
    if (!inventory) {
      return res.status(404).json({ success: false, message: "Không tìm thấy tồn kho" });
    }
    res.json({ success: true, data: inventory });
  } catch (err) {
    next(err);
  }
};

// POST /api/inventory/add-stock - Increase stock
// Body: { product: "<productId>", quantity: <number> }
const addStock = async (req, res, next) => {
  try {
    const { product, quantity } = req.body;
    validateQty(quantity);

    const inv = await findInventory(product);
    inv.stock += quantity;
    await inv.save();

    res.json({
      success: true,
      message: `Đã thêm ${quantity} vào tồn kho.`,
      data: inv,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/inventory/remove-stock - Decrease stock
// Body: { product: "<productId>", quantity: <number> }
const removeStock = async (req, res, next) => {
  try {
    const { product, quantity } = req.body;
    validateQty(quantity);

    const inv = await findInventory(product);

    if (inv.stock - quantity < 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể giảm ${quantity}. Tồn kho hiện tại chỉ còn ${inv.stock}.`,
      });
    }

    inv.stock -= quantity;
    await inv.save();

    res.json({
      success: true,
      message: `Đã giảm ${quantity} khỏi tồn kho.`,
      data: inv,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/inventory/reservation - Reserve items (stock↓, reserved↑)
// Body: { product: "<productId>", quantity: <number> }
const reservation = async (req, res, next) => {
  try {
    const { product, quantity } = req.body;
    validateQty(quantity);

    const inv = await findInventory(product);

    if (inv.stock - quantity < 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể giữ chỗ ${quantity}. Tồn kho khả dụng chỉ còn ${inv.stock}.`,
      });
    }

    inv.stock -= quantity;
    inv.reserved += quantity;
    await inv.save();

    res.json({
      success: true,
      message: `Đã giữ chỗ ${quantity} sản phẩm. Tồn kho giảm, giữ chỗ tăng.`,
      data: inv,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/inventory/sold - Confirm sale (reserved↓, soldCount↑)
// Body: { product: "<productId>", quantity: <number> }
const sold = async (req, res, next) => {
  try {
    const { product, quantity } = req.body;
    validateQty(quantity);

    const inv = await findInventory(product);

    if (inv.reserved - quantity < 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xác nhận đã bán ${quantity}. Số lượng giữ chỗ chỉ còn ${inv.reserved}.`,
      });
    }

    inv.reserved -= quantity;
    inv.soldCount += quantity;
    await inv.save();

    res.json({
      success: true,
      message: `Đã xác nhận bán ${quantity} sản phẩm. Giữ chỗ giảm, đã bán tăng.`,
      data: inv,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllInventory,
  getInventoryById,
  addStock,
  removeStock,
  reservation,
  sold,
};
