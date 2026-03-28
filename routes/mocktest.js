const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const refreshUser = require("../middleware/refreshUser");
const mocktestController = require("../controllers/mocktestController");
const pdfResultController = require("../controllers/pdfResultController");

// initalize mocktest 
router.get(
  "/init/:examcode/:subjectcode",
  requireLogin,
  mocktestController.init
);

// Create mocktest Order and Start mocktest
router.post(
  "/createorder",
  requireLogin,
  mocktestController.createOrder
);

// Submit mocktest
router.post(
  "/submit",
  requireLogin,
  refreshUser,
  mocktestController.submit
);

// Download result PDF
router.get(
  "/result/pdf/:mocktestid",
  pdfResultController.downloadResultPdf);

// send result PDF email
router.get(
  "/result/pdf/:mocktestid",
  pdfResultController.emailResultPdf);

module.exports = router;
