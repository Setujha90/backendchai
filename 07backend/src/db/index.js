import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';


//2nd way to connect to MongoDB and it is recommended to use this way

const connectDB= async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
         console.log(`MongoDB connected successfully !! Database Name: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process with failure
    }
}

// Export the connectDB function
export default connectDB;