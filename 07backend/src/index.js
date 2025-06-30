import express from "express"
const app=express();


//require('dotenv').config({path: './env'}); 
import 'dotenv/config'; 

// import mongoose from 'mongoose';
// import { DB_NAME } from './constants.js';
import connectDB from './db/index.js';

// dotenv.config({ path: './env' }); 

// 2nd way to connect to MongoDB and it is recommended to use this way
connectDB()
.then(()=>{ //returnng promise due to async function
    app.listen(process.env.PORT || 5000,()=>{
        console.log(`Server is running at ${process.env.PORT}`)
    })
})
.catch((error)=>{
  console.error("ERORR TO CONNECT",error);
})

// Importing routes
import { userRouter } from './routes/user.routes.js';  


app.get('/',(req,res)=>{
    res.send("user login")
})

//routes declaration
//here we can't use app.get() becuse initially we are defining the routes in this file but now we are importing the routes from user.routes.js file ,so we need to use middleware 
app.use('/api/v1/users',userRouter); // /api/v1/users is the base route for user-related operations,on clicking on this control will be passed to userRouter which is defined in user.routes.js




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

export {app}