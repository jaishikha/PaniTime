const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");
const City = require("../models/City");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, city } = req.body;

    const selectedCity = await City.findOne({
      name: city
    });

    if (!selectedCity) {
      return res.status(400).json({
        message: "Invalid city selected."
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      city
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed"
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Account is inactive. Please contact the administrator."
      });
    }
    
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        city: user.city
        },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    console.log("LOGIN USER FROM DB:", user);
    
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed"
    });
  }
});

// Change password
router.patch("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Check required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required."
      });
    }

    // Get the logged-in user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    // Verify current password
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Current password is incorrect."
      });
    }

    // Prevent using the same password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from current password."
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({
      message: "Password changed successfully."
    });
  } catch (error) {
    console.error("Change password error:", error);

    res.status(500).json({
      message: "Failed to change password."
    });
  }
});

// Follow a locality
router.post("/follow-locality", protect, async (req, res) => {
  try {
    const { locality } = req.body;
    const userId = req.user.id;

    if (!userId || !locality) {
      return res.status(400).json({
        message: "User ID and locality are required"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.followedLocalities.includes(locality)) {
      return res.status(400).json({
        message: "Already following this locality"
      });
    }

    user.followedLocalities.push(locality);

    await user.save();

    res.json({
      message: "Locality followed successfully",
      followedLocalities: user.followedLocalities
    });
  } catch (error) {
    console.error("Follow locality error:", error);

    res.status(500).json({
      message: "Failed to follow locality"
    });
  }
});

// Unfollow a locality
router.post("/unfollow-locality", protect, async (req, res) => {
  try {
    const { locality } = req.body;
    const userId = req.user.id;

    if (!userId || !locality) {
      return res.status(400).json({
        message: "User ID and locality are required"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.followedLocalities = user.followedLocalities.filter(
      (item) => item.toLowerCase() !== locality.toLowerCase()
    );

    await user.save();

    res.json({
      message: "Locality unfollowed successfully",
      followedLocalities: user.followedLocalities
    });
  } catch (error) {
    console.error("Unfollow locality error:", error);

    res.status(500).json({
      message: "Failed to unfollow locality"
    });
  }
});

// Get followed localities
router.get("/followed-localities", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      followedLocalities: user.followedLocalities || []
    });
  } catch (error) {
    console.error("Get followed localities error:", error);

    res.status(500).json({
      message: "Failed to fetch followed localities"
    });
  }
});


module.exports = router;

