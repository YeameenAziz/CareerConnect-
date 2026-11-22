const express = require("express");

const {
    createJob,
    getAllJobs,
    getFeaturedJobs,
    getSingleJob, 
    updateJob, 
    deleteJob
} = require("../controllers/jobController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get All Jobs - Public Route
router.get("/", getAllJobs);


// Create Job - Recruiter Only
router.post(
    "/",
    protect,
    authorizeRoles("recruiter"),
    createJob
);

// Get Featured Jobs - Public Route
router.get("/featured", getFeaturedJobs);

// Get Single Job - Public Route
router.get("/:id", getSingleJob);

// Update Job - Recruiter Only
router.put(
  "/:id",
  protect,
  authorizeRoles("recruiter"),
  updateJob
);

// Delete Job - Recruiter Only
router.delete(
  "/:id",
  protect,
  authorizeRoles("recruiter"),
  deleteJob
);



module.exports = router;