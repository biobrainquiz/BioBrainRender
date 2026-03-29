const express = require("express");
const router = express.Router();
const authenticationController = require("../controllers/authenticationController");

// Login
router.post("/login", authenticationController.login);

// Logout
router.get("/logout", authenticationController.logout);

// Register
router.post("/register", authenticationController.register);

// Forgot Password
router.post("/forgot", authenticationController.forgotPassword);

// Show Reset Password Page
router.get("/showresetpage/:token", authenticationController.showResetPage);

// Reset Password
router.post("/reset/:token", authenticationController.resetPassword);

// Verify Email
router.get("/verify-email/:token", authenticationController.verifyEmail);

// POST route for the actual logic (used by all three scenarios)
router.post("/resend-verification", authenticationController.resendVerification);

// GET routes to show the pages
router.get("/check-email", authenticationController.showCheckEmailPage);

router.get("/resend-link-page", authenticationController.showResendPage);



module.exports = router;