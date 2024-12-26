import http from 'http'
import app from './app.js'
import dotenv from 'dotenv'
dotenv.config();

const server = http.createServer(app)
const port = process.env.PORT || 3000;



server.listen(port,(req,res)=>{
    console.log(`server staterd on port ${port}`)
})