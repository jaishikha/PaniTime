const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const City = require("../models/City");

const {
  protect,
  platformAdminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get all city admins
router.get(
  "/admins",
  protect,
  platformAdminOnly,
  async (req, res) => {
    try {
      const admins = await User.find({
        role: "admin"
      })
        .select("name email city isActive createdAt")
        .sort({ createdAt: -1 });

      res.json(admins);
    } catch (error) {
      console.error("Fetch admins error:", error);

      res.status(500).json({
        message: "Failed to fetch admins."
      });
    }
  }
);

// Create a new city admin
router.post("/admins", protect, platformAdminOnly, async (req, res) => {
  try {
    const { name, email, password, city } = req.body;

    // Check whether the selected city exists
    const selectedCity = await City.findOne({
      name: city
    });

    if (!selectedCity) {
      return res.status(400).json({
        message: "Invalid city selected."
      });
    }

    // Check whether email is already registered
    const existingUser = await User.findOne({
      email
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered."
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create admin
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      city,
      isActive: true
    });

    res.status(201).json({
      message: "Admin created successfully.",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        city: admin.city,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    console.error("Create admin error:", error);

    res.status(500).json({
      message: "Failed to create admin."
    });
  }
});

// Deactivate a city admin
router.patch(
  "/admins/:id/deactivate",
  protect,
  platformAdminOnly,
  async (req, res) => {
    try {
      const admin = await User.findOne({
        _id: req.params.id,
        role: "admin"
      });

      if (!admin) {
        return res.status(404).json({
          message: "Admin not found."
        });
      }

      admin.isActive = false;
      await admin.save();

      res.json({
        message: "Admin deactivated successfully.",
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          city: admin.city,
          isActive: admin.isActive
        }
      });
    } catch (error) {
      console.error("Deactivate admin error:", error);

      res.status(500).json({
        message: "Failed to deactivate admin."
      });
    }
  }
);

module.exports = router;