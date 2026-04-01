const mongoose = require("mongoose");
const Inventory = require("./inventory.model");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên sản phẩm là bắt buộc"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Giá là bắt buộc"],
      min: [0, "Giá không được âm"],
    },
    category: {
      type: String,
      trim: true,
      default: "Uncategorized",
    },
  },
  {
    timestamps: true,
  }
);

// ─── Auto-create Inventory when a Product is created ───────────────────────
productSchema.post("save", async function (doc) {
  try {
    const existing = await Inventory.findOne({ product: doc._id });
    if (!existing) {
      await Inventory.create({ product: doc._id });
      console.log(`Đã tạo tồn kho cho sản phẩm: ${doc.name}`);
    }
  } catch (err) {
    console.error("Tạo tồn kho thất bại:", err.message);
  }
});

module.exports = mongoose.model("Product", productSchema);
