import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const registerUser = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new userModel({ email, password: hashedPassword });
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email }, // Payload
      process.env.JWT_SECRET, // Secret key from .env
      { expiresIn: "1h" } // Token expiry
    );

    // Respond with the token and user data
    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, email: newUser.email },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};



export const loginUser = async (req, res) => {

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if the user exists
    const existingUser = await userModel.findOne({ email }).select("+password"); // Include the password field
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiry
    );

    // Send response with token and success message
    res.status(200).json({
      message: "Successfully logged in",
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error", error });
  }
};




// Controller for getting user profile
export const getuserProfile = async (req, res) => {
  try {
    const { id, email } = req.user;

    // Find the user in the database
    const user = await userModel.findById(id).select("email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with user details
    res.status(200).json({
      message: "User profile retrieved successfully",
      user: { email: user.email },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error retrieving user profile", error });
  }
};


export const logoutUser = async (req, res) => {
  try {
    // Extract token from headers or cookies
    const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    redisClient.set(token, 'logout', 'EX', 60 * 60 * 24);

    res.status(200).json({
        message: 'Logged out successfully'
    });
  } catch (error) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

