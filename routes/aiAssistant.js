const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const aiAssistanceController = require("../controllers/aiAssistanceController");


// Download PDF
router.post(
    "/aiassistant/explainanswer",
    requireLogin,
    aiAssistanceController.aiExplainAnswer);

router.post(
    "/aiassistant/singlequizsummary",
    requireLogin,
    aiAssistanceController.aiSingleQuizSummary);

router.post(
    "/aiassistant/allquizsummary",
    requireLogin,
    aiAssistanceController.aiAllQuizSummary);

module.exports = router;