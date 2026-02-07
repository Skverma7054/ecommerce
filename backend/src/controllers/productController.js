const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

// Fetch all products for catalog listing.
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Products fetched",
    data: products,
  });
});

// Fetch a single product by ID.
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Product fetched",
    data: product,
  });
});

// Create a new product (admin only).
const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, stock, category, images } = req.body;

  if (!title || !description || price === undefined || stock === undefined || !category) {
    return res.status(400).json({
      success: false,
      message: "Missing required product fields",
    });
  }

  const product = await Product.create({
    title,
    description,
    price,
    stock,
    category,
    images: images || [],
  });

  res.status(201).json({
    success: true,
    message: "Product created",
    data: product,
  });
});

// Update product details (admin only).
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  const updates = req.body;
  Object.assign(product, updates);
  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated",
    data: product,
  });
});

// Delete a product (admin only).
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted",
  });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
