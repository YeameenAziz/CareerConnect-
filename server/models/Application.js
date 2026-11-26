
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },

    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    coverLetter: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Shortlisted", "Rejected"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index(
  { jobId: 1, applicantId: 1 },
  { unique: true }
);

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
