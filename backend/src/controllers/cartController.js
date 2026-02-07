const Cart = require("../models/Cart");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

// Get cart for logged-in user.
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");

  if (!cart) {
    cart = await Cart.create({ userId: req.user._id, items: [] });
  }

  res.status(200).json({
    success: true,
    message: "Cart fetched",
    data: cart,
  });
});

// Add an item to cart or increase quantity.
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({
      success: false,
      message: "Product ID and quantity are required",
    });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    cart = await Cart.create({ userId: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
  if (itemIndex >= 0) {
    cart.items[itemIndex].quantity += Number(quantity);
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart updated",
    data: cart,
  });
});

// Update item quantity in cart.
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    return res.status(400).json({
      success: false,
      message: "Product ID and quantity are required",
    });
  }

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  const item = cart.items.find((entry) => entry.productId.toString() === productId);
  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Item not found in cart",
    });
  }

  item.quantity = Number(quantity);
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart item updated",
    data: cart,
  });
});

// Remove an item from cart.
const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required",
    });
  }

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  cart.items = cart.items.filter((entry) => entry.productId.toString() !== productId);
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Item removed",
    data: cart,
  });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
