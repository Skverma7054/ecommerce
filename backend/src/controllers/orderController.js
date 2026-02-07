const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

// Creates an order from the user's cart.
const createOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty",
    });
  }

  const items = cart.items.map((item) => ({
    productId: item.productId._id,
    title: item.productId.title,
    price: item.productId.price,
    quantity: item.quantity,
  }));

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await Order.create({
    userId: req.user._id,
    items,
    totalAmount,
    status: "pending",
  });

  // Decrease stock for each purchased product.
  for (const item of items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity },
    });
  }

  // Clear cart after order is placed.
  cart.items = [];
  await cart.save();

  res.status(201).json({
    success: true,
    message: "Order placed",
    data: order,
  });
});

// Get orders for current user.
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Orders fetched",
    data: orders,
  });
});

// Admin: get all orders.
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("userId", "name email").sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "All orders fetched",
    data: orders,
  });
});

module.exports = { createOrder, getMyOrders, getAllOrders };
