const express = require("express");
const router = express.Router();

const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
} = require("../controllers/applicationController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

// Applicant applies for a job
router.post(
  "/:jobId",
  protect,
  authorizeRoles("applicant"),
  applyForJob
);

// Applicant views own applications
router.get(
  "/my-applications",
  protect,
  authorizeRoles("applicant"),
  getMyApplications
);

// Recruiter views applications for their job
router.get(
  "/job/:jobId",
  protect,
  authorizeRoles("recruiter"),
  getJobApplications
);

// Update application status
router.patch(
  "/:applicationId/status",
  protect,
  authorizeRoles("recruiter"),
  updateApplicationStatus
);

module.exports = router;