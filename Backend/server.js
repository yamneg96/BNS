import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import assignmentRoutes from './routes/assignmentRoutes.js';
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js"

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
const allowedOrigins = [
  'https://bns-beta.vercel.app',
  'http://localhost:5173', // for local testing
];

// Use CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman or server-to-server
    if (allowedOrigins.indexOf(origin) === -1) {
      console.error(`CORS Error: Origin ${origin} not allowed`);
      return callback(new Error('CORS policy does not allow access from this origin'), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes)

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process?.env?.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
