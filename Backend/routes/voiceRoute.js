const express = require("express");
const router = express.Router();
const voiceController = require("../controllers/voiceController");
const { isAuthenticated } = require("../middleware/auth.middleware");

router.post("/interpret", isAuthenticated, voiceController.interpretCommand);
router.get("/getProductByName", isAuthenticated, voiceController.getProductsByName);

module.exports = router;