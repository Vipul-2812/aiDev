import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

const connectDB = async()=>{
   
    await mongoose.connect(process.env.mongodbURL)
    .then(()=>{
        console.log("mongodb connected")
        
    })
    .catch((err)=>{
        console.log(process.env.mongodbURL)
        console.log(`error while connecting to the database is : ${err}`)
        
       
    })
}

export default connectDB;


