import express from "express";
import { initiatePayment, paymentCallback, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

// POST → initiate payment (after OTP verified)
router.post("/initiate", initiatePayment);

// POST → Chapa callback (webhook)
router.post("/callback", paymentCallback);

router.get("/verify/:tx_ref", verifyPayment);

export default router;