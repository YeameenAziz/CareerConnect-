
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    company: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    salary: {
      type: String,
      required: true
    },

    jobType: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Internship", "Remote", "Contract"]
    },

    category: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    requirements: {
      type: [String],
      default: []
    },

    responsibilities: {
      type: [String],
      default: []
    },

    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
