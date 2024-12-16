import dotenv from "dotenv"
import mongoose from "mongoose";
import express from "express";
import {connectDB} from "../db/db.js"

dotenv.config({
    path:'./.env'
})


const app = express()

const port = process.env.PORT;

connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`)
    })
})
.catch(()=>{

})
