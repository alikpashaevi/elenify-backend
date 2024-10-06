import express from "express";
import mongoose from "mongoose";  // Corrected the mongoose import
import cors from "cors";
import env from "dotenv";
import connectDb from "./db.js";

const app = express();
const port = 3000;
const saltRounds = 10;

// Middleware
app.use(cors());
app.use(express.json());
env.config();

// Connect to MongoDB
connectDb();

// Routes


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
