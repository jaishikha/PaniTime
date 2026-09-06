const express = require("express");
const WaterStatus = require("../models/WaterStatus");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Get water status
router.get("/", protect, async (req, res) => {
  try {
    const { area } = req.query;

    // User can only access water data from their own city
    let query = {
      city: req.user.city
    };

    if (area) {
      query.area = {
        $regex: `^${area}$`,
        $options: "i"
      };
    }

    const statuses = await WaterStatus.find(query).sort({
      createdAt: -1
    });

    res.json(statuses);
  } catch (error) {
    console.error("Fetch water status error:", error);

    res.status(500).json({
      message: "Failed to fetch water status"
    });
  }
});

// Add a new water status
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { area, date, startTime, endTime, status } = req.body;

    // City comes from the authenticated admin's JWT
    const city = req.user.city;

    const newStatus = await WaterStatus.create({
      city,
      area,
      date,
      startTime,
      endTime,
      status
    });

    // Find residents from the same city
    // who are following this locality
    const followers = await User.find({
      role: "resident",
      city: city,
      followedLocalities: {
        $elemMatch: {
          $regex: `^${area}$`,
          $options: "i"
        }
      }
    });

    // Create notifications
    const notifications = followers.map((user) => ({
      user: user._id,
      locality: area,
      message: `Water supply update for ${area}: ${status}. New timing: ${startTime} - ${endTime}.`
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({
      message: "Water status updated successfully",
      waterStatus: newStatus,
      notificationsCreated: notifications.length
    });
  } catch (error) {
    console.error("Add water status error:", error);

    res.status(500).json({
      message: "Failed to add water status"
    });
  }
});

module.exports = router;