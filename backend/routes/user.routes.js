import express from 'express';
import { body } from "express-validator";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

import { registerUser , loginUser,getuserProfile, logoutUser} from "../controllers/user.controller.js";
import redisClient from '../services/redis.service.js';
const router = express.Router();




router.post("/register",  [
    // Validation rules using express-validator
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password")
      .isLength({ min: 4 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/\d/)
      .withMessage("Password must contain at least one number"),
  ], registerUser)

router.post("/login",[
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password")
      .isLength({ min: 4 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/\d/)
      .withMessage("Password must contain at least one number"),
  ],loginUser)



  // Middleware for authentication
 export const authMiddleware = async(req, res, next) => {
    try {
      // Extract token from cookies or headers
      const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token ;
      // console.log("Extracted Token:", token);
  
      if (!token) {
        return res.status(401).json({ message: "Authentication token not provided" });
      }

    // Check if the token exists in the blacklist (Redis)
    const blacklistedToken = await redisClient.get(token);
    console.log(blacklistedToken)
    if (blacklistedToken) {
      return res.status(401).json({ error: 'Unauthorized User' });
    }
  
      // Log the secret to verify it's loaded correctly
      // console.log("JWT_SECRET in middleware:", process.env.JWT_SECRET);
  
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("Decoded Token Payload:", decoded);
  
      // Attach user info to request
      req.user = { id: decoded.id, email: decoded.email };
      console.log("User attached to request:", req.user);
  
      next(); // Proceed to the next middleware/controller
    } catch (error) {
      console.error("Error verifying token:", error);
      res.status(401).json({ error: 'Unauthorized User' });
    }
  };

router.get("/profile",authMiddleware,getuserProfile)

router.get("/logout",authMiddleware,logoutUser)


export default router;