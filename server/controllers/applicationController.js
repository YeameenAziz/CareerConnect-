
const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");

// Apply for a job
const applyForJob = async (req, res) => {
  try {
    const { coverLetter } = req.body;
    const { jobId } = req.params;

    // Check cover letter
    if (!coverLetter || !coverLetter.trim()) {
      return res.status(400).json({
        success: false,
        message: "Cover letter is required"
      });
    }

    // Check whether job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // Check duplicate application
    const existingApplication = await Application.findOne({
      jobId,
      applicantId: req.user.id
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job"
      });
    }

    // Create application
    const application = await Application.create({
      jobId,
      applicantId: req.user.id,
      coverLetter
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application
    });

  } catch (error) {
    // Handle duplicate application at database level
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job"
      });
    }
    console.error("Error in applyForJob:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get logged-in applicant's applications
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicantId: req.user.id
    })
      .populate("jobId") // populate function is used to get all information about the job
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalApplications: applications.length,
      applications
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all applications for a recruiter's job
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check whether job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // Check job ownership
    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view these applications"
      });
    }

    // Find all applications for this job
    const applications = await Application.find({ jobId })
      .populate("applicantId", "name email phone location skills")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalApplications: applications.length,
      applications
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Update application status (Recruiter only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    // Validate Application ID
    if (!/^[0-9a-fA-F]{24}$/.test(applicationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID"
      });
    }

    // Validate status
    const allowedStatuses = [
      "Pending",
      "Reviewed",
      "Shortlisted",
      "Rejected"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: Pending, Reviewed, Shortlisted, Rejected"
      });
    }

    // Find application
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // Find the job related to this application
    const job = await Job.findById(application.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // Check whether the logged-in recruiter owns this job
    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this application"
      });
    }

    // Update status
    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



module.exports = { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus };
