import express from "express";
import { 
  uploadPaymentScreenshot} from "../controllers/paymentController.js";
import upload from "../middleware/upload.js";


const router = express.Router();

router.post("/upload-screenshot", upload.single("screenshot"), uploadPaymentScreenshot); 



export default router;
