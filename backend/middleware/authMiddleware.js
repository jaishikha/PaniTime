const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized. Token missing."
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Get the latest user information from database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "Not authorized. User not found."
      });
    }

    // Check whether the account is active
    if (!user.isActive) {
      return res.status(401).json({
        message: "Account is inactive."
      });
    }

    // Use current database values
    req.user = {
      id: user._id,
      role: user.role,
      city: user.city
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized. Invalid token."
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only."
    });
  }

  next();
};

const platformAdminOnly = (req, res, next) => {
  if (req.user.role !== "platformAdmin") {
    return res.status(403).json({
      message: "Access denied. Platform Admin only."
    });
  }

  next();
};

module.exports = {
  protect,
  adminOnly,
  platformAdminOnly
};