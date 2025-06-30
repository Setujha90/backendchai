import { v2 as cloudinary } from 'cloudinary'; // Importing the Cloudinary library to handle image uploads and transformations
import fs from 'fs'; // Importing the file system module to handle file operations
import 'dotenv/config'; // Importing environment variables from the .env file


// Configuration for Cloudinary
 cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary=async (localfilepath)=>{
    try{
       if(!localfilepath) return null; // If no file path is provided, return null
        const response= await cloudinary.uploader.upload(localfilepath,{ // Uploading the file to Cloudinary
            resource_type:"auto", // Automatically determine the resource type (image, video, etc.)
        })
        console.log("file uploaded successfully on cloudinary",response.url); // Log the successful upload and the URL of the uploaded file
        return response
    }
    catch(error){
         fs.unlinkSync(localfilepath); //remove the file from local storage if an error occurs during upload 
         return null; // Return null if the upload fails
    }
}

export {uploadOnCloudinary}; // Export the uploadOnCloudinary function for use in other modules
