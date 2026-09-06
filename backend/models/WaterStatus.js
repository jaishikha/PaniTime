const mongoose = require("mongoose");

const waterStatusSchema = new mongoose.Schema(
  {

    city: {
      type: String,
      required: true,
      default: "Jodhpur"
    },
    
    area: {
      type: String,
      required: true
    },

    date: {
      type: String,
      required: true
    },

    startTime: {
      type: String,
      required: true
    },

    endTime: {
      type: String,
      required: true
    },

    status: {
      type: String,
      required: true,
      enum: ["Expected", "Live", "Completed", "Delayed", "Cancelled"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("WaterStatus", waterStatusSchema);

