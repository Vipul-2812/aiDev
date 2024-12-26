import cookieParser from "cookie-parser";
import express from "express";
const app = express();
import cors from 'cors';
import dotenv from 'dotenv'
import connectDB from "./db/db.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();



app.use(express.json());
app.use(cookieParser())
app.use(cors())

connectDB()

// Define the base route for user-related endpoints
app.use("/user", userRouter);

app.get("/",(req,res)=>{
    res.send("server starte hello route")
})



export default app;