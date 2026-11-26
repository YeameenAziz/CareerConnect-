
const express = require("express");
const { register, login, updateProfile } = require("../controllers/authController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Protected test route
router.get("/verify", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication successful",
    user: req.user
  });
});


// Applicant only route
router.get(
  "/applicant-test",
  protect,
  authorizeRoles("applicant"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Applicant!",
      user: req.user
    });
  }
);

// Recruiter only route
router.get(
  "/recruiter-test",
  protect,
  authorizeRoles("recruiter"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Recruiter!",
      user: req.user
    });
  }
);

router.put(
  "/update-profile",
  protect,
  updateProfile
);

module.exports = router;
