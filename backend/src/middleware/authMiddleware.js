const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

// Auth middleware validates JWT and attaches user to the request.
// Flow: client sends token -> middleware verifies -> req.user is set -> controller uses req.user.
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, missing token",
    });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, user not found",
    });
  }

  req.user = user;
  next();
});

// Role-based access control middleware for admin-only routes.
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};

module.exports = { protect, requireAdmin };
