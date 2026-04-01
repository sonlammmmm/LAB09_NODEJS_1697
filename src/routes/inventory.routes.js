const express = require("express");
const router = express.Router();
const {
  getAllInventory,
  getInventoryById,
  addStock,
  removeStock,
  reservation,
  sold,
} = require("../controllers/inventory.controller");

router.get("/", getAllInventory);
router.get("/:id", getInventoryById);
router.post("/add-stock", addStock);
router.post("/remove-stock", removeStock);
router.post("/reservation", reservation);
router.post("/sold", sold);

module.exports = router;