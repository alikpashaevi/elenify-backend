import express from "express";
import mongoose from "mongoose";  // Corrected the mongoose import
import cors from "cors";
import env from "dotenv";
import connectDb from "./db.js";
import User from "./models/user.js";
import bcrypt from "bcrypt";

env.config();

const app = express();
const port = 3000;
const saltRounds = 10;

// Middleware
app.use(cors());
app.use(express.json());


// Connect to MongoDB
connectDb();

// Routes

//Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    res.json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
)

// Register a new user
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with the hashed password
    const user = new User({ username, password: hashedPassword });

    // Save the user to the database
    await user.save();

    res.json({ msg: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
