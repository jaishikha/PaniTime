const express = require("express");
const Issue = require("../models/Issue");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all reported issues for admin's city
router.get("/", protect, adminOnly, async (req, res) => {
  console.log("ISSUES API USER:", req.user);

  try {
    const issues = await Issue.find({
      city: req.user.city
    }).sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch issues"
    });
  }
});

// Report a new issue
router.post("/", protect, async (req, res) => {
  try {
    const { area, issue, description } = req.body;

    // City comes from the authenticated user's JWT
    const city = req.user.city;

    const newIssue = await Issue.create({
      city,
      area,
      issue,
      description
    });

    res.status(201).json(newIssue);
  } catch (error) {
    console.error("Report issue error:", error);

    res.status(500).json({
      message: "Failed to report issue"
    });
  }
});

// Mark an issue as resolved
router.patch("/:id", protect, adminOnly, async (req, res) => {
  try {
    const updatedIssue = await Issue.findOneAndUpdate(
      {
        _id: req.params.id,
        city: req.user.city
      },
      { status: "Resolved" },
      { new: true }
    );

    if (!updatedIssue) {
      return res.status(404).json({
        message: "Issue not found"
      });
    }

    res.json(updatedIssue);
  } catch (error) {
    console.error("Resolve issue error:", error);

    res.status(500).json({
      message: "Failed to update issue"
    });
  }
});

module.exports = router;