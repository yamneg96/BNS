import express from "express";
import { sendSupportEmail, sendRefinedMessage, getMessages, updateMessageReadStatus } from "../controllers/supportController.js";

const router = express.Router();


router.post("/", sendSupportEmail);
router.post("/refined-message", sendRefinedMessage);
router.get("/messages", getMessages);
router.patch('/messages/:id/read', updateMessageReadStatus);

export default router;
