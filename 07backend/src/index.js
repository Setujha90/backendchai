//require('dotenv').config({path: './env'}); 
import 'dotenv/config'; 

// import mongoose from 'mongoose';
// import { DB_NAME } from './constants.js';
import connectDB from './db/index.js';

// dotenv.config({ path: './env' }); 

// 2nd way to connect to MongoDB and it is recommended to use this way
connectDB()
.then(()=>{ //returnng promise due to async function
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at ${process.env.PORT}`)
    })
})
.catch((error)=>{
  console.error("ERORR TO CONNECT",error);
})

//first way to connect to MongoDB but it is not recommended to use this way
/*
import express from "express"
const app=express();
(async ()=>{ // Connect to MongoDB
    try{
    await mongoose.connect(`${process.env.MONGODB_URI}/{DB_NAME}`, )
   app.on('error', () => { //if express app not able to connect to mogoDB
        console.error('MongoDB connection error:', error);

    })

    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
    }catch(error){
        console.error("ERROR:",error)
        throw error;
    }
})()
*/