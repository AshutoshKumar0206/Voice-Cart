import express from "express";
import {
  interpretCommand,
  getProductsByName,
} from "../controllers/voiceController.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/interpret", interpretCommand);
router.post("/getProductByName", isAuthenticated, getProductsByName);

export default router;
