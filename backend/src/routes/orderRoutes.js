const express = require("express");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
} = require("../controllers/orderController");
const { protect, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/", protect, requireAdmin, getAllOrders);

module.exports = router;
