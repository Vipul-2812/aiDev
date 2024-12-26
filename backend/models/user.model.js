import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"], // Added required validation
    minLength: [7, "Email must be at least 3 characters long"], // Proper error message
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"], // Added required validation
    minLength: [3, "Password must be at least 3 characters long"], // Proper error message
    select: false, // By default, exclude this field when querying
  },
});

const userModel = mongoose.model("User",userSchema);

export default userModel;
