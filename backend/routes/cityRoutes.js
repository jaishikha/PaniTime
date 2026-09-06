const express = require("express");
const City = require("../models/City");

const {
  protect,
  platformAdminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get all available cities
router.get("/", async (req, res) => {
  try {
    const cities = await City.find()
      .select("name")
      .sort({ name: 1 });

    res.json(cities);
  } catch (error) {
    console.error("Fetch cities error:", error);

    res.status(500).json({
      message: "Failed to fetch cities"
    });
  }
});

// Add a new city
router.post("/", protect, platformAdminOnly, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "City name is required."
      });
    }

    const cityName = name.trim();

    // Check if city already exists
    const existingCity = await City.findOne({
      name: {
        $regex: `^${cityName}$`,
        $options: "i"
      }
    });

    if (existingCity) {
      return res.status(400).json({
        message: "City already exists."
      });
    }

    const city = await City.create({
      name: cityName
    });

    res.status(201).json({
      message: "City added successfully.",
      city
    });
  } catch (error) {
    console.error("Add city error:", error);

    res.status(500).json({
      message: "Failed to add city."
    });
  }
});

module.exports = router;