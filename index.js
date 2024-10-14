import express from "express";
import mongoose from "mongoose";  // Corrected the mongoose import
import cors from "cors";
import env from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// claudinary
import { v2 as cloudinary } from 'cloudinary';

// Import models and db
import connectDb from "./db.js";
import User from "./models/user.js";
import Image from "./models/image.js";

env.config();
cloudinary.config({ 
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  secure: true,
  api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const app = express();
const port = 4000;
// const saltRounds = process.env.SALT_ROUNDS;
const saltRounds = 10;

// Middleware
app.use(cors());
app.use(express.json());


// Connect to MongoDB
connectDb();

// Routes

// Get Users
app.get("/api/users", async (req, res) => {
  const token = req.headers["authorization"];

  if(!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const removeBearer = token.split(" ")[1];
  try {
    const verified = jwt.verify(removeBearer, process.env.JWT_SECRET);
    const userName = verified.username
    
    if(!userName) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ username: userName });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

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
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
    res.status(200).send({
      name: user.username,
      accessToken: token,
       message: "Login successful"
    });
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
  // drop the index
  // await mongoose.connection.db.dropCollection('users');

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

// add image

app.post("/api/addImage", async (req, res) => {
  const { username, image, path } = req.body;
  console.log(username, imageUrl);
  try {
    const author = await User.findOne({ username });

    if (!author) {
      return res.status(400).json({ message: "User not found" });
    }
    const newImage = await Image.create({
      ...image,
      author: author._id,
    })
    res.status(200).json({ message: "Image added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
})

// update image
app.put("/api/updateImage/:id", async (req, res) => {
  const { id } = req.params;
  const { image, username } = req.body;
  try {
    const imageToUpdate = await Image.findById(image._id);

    if (!imageToUpdate || imageToUpdate.author.toHexString() !== username) {
      throw new Error("Unauthorized or image not found");
    }

    const updatedImage = await Image.findByIdAndUpdate(
      imageToUpdate._id,
      image,
      { new: true }
    )
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
    
  }
})

// delete image
app.delete("/api/deleteImage/:id", async (req, res) => {
  const {imageId} = req.params;
  // const { username } = req.body;
  try {
    await Image.findByIdAndDelete(imageId);
    // if (!image) {
    //   return res.status(404).json({ message: "Image not found" });
    // }
  } catch (error) {
    console.error(error)
  }
})

// get image
app.get("/api/getImage/:id", async (req, res) => {
  const { imageId } = req.params;
  try {
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.json(image);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
