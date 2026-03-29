const express = require("express");
const router = express.Router();
const aiBotController = require("../controllers/aiBotController");

router.post(
    "/ask-zoology-bot",
    aiBotController.askbot);    

module.exports = router;