const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Yêu cầu phải có tham chiếu sản phẩm"],
      unique: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Số tồn không được âm"],
    },
    reserved: {
      type: Number,
      default: 0,
      min: [0, "Số lượng giữ chỗ không được âm"],
    },
    soldCount: {
      type: Number,
      default: 0,
      min: [0, "Số lượng đã bán không được âm"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inventory", inventorySchema);
