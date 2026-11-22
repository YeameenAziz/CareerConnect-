
const Job = require("../models/Job");
const mongoose = require("mongoose");

// Create Job
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      salary,
      jobType,
      category,
      description,
      requirements,
      responsibilities,
      featured
    } = req.body;

    // Check required fields
    if (
      !title ||
      !company ||
      !location ||
      !salary ||
      !jobType ||
      !category ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    // Create new job
    const job = await Job.create({
      title,
      company,
      location,
      salary,
      jobType,
      category,
      description,
      requirements,
      responsibilities,
      featured: featured === true,
      recruiterId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Get All Jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalJobs: jobs.length,
      jobs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Single Job
const getSingleJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    res.status(200).json({
      success: true,
      job
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Featured Jobs
const getFeaturedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      totalJobs: jobs.length,
      jobs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Job
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Check valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID"
      });
    }

    // Find the Job
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // Check Job ownership
    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own jobs"
      });
    }

    // Only allow these fields to be updated
    const allowedFields = [
      "title",
      "company",
      "location",
      "salary",
      "jobType",
      "category",
      "description",
      "requirements",
      "responsibilities"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    const updatedJob = await job.save();

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Check valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID"
      });
    }

    // Find the Job
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // Check Job ownership
    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own jobs"
      });
    }

    await Job.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createJob, getAllJobs, getSingleJob, getFeaturedJobs, updateJob, deleteJob };
