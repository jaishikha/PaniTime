const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["resident", "admin", "platformAdmin"],
      default: "resident"
    },

    city: {
      type: String,
      required: function () {
        return this.role !== "platformAdmin";
      }
    },

    followedLocalities: {
      type: [String],
      default: []
    },

    isActive: {
      type: Boolean,
      default: true
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);

