import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { predictDiagnosis } from "../controllers/aiController.js";

const router = express.Router();

router.post("/predict", protect, predictDiagnosis);

export default router