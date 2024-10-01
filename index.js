import express from "express";
import mongoose from "mongodb";
import cors from "cors";
import env from "dotenv";

const app = express();
const port = 3000;
const saltRounds = 10;

// Middleware
app.use(cors());
app.use(express.json());
env.config();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
