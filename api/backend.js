import app, { startServer } from "../Backend/server.js";
import connectDB from "../Backend/config/db.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    return app(req, res);
  } catch (err) {
    console.error("Error in Vercel handler:", err);
    res.status(500).send("Internal Server Error");
  }
}
