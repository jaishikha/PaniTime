const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
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

    issue: {
      type: String,
      required: true,
      enum: [
        "Dirty Water",
        "Low Pressure",
        "Wrong Timing",
        "No Water Supply",
        "Other"
      ]
    },

    description: {
      type: String
    },

    status: {
      type: String,
      enum: ["Pending", "Resolved"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Issue", issueSchema);

