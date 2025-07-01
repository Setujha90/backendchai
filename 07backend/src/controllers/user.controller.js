import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"; // Importing ApiError for error handling
import {User} from "../models/user.model.js"; // Importing User model to interact with the user collection in the database
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";


const registerUser=asyncHandler( async (req,res)=>{ // This is an example of an async function wrapped in asyncHandler
   // return res.status(200).json({ // Sending a JSON response with status 200
   //  message:"ok"    
   // })

   //Process for registration

   //take all the information from fronted
   //validate it ,these are according to define field : empty field 
   //check if user already exist in the database : by username or email id
   //check avatar and cover image is given by user or not
   //upload them on cloudinary
   //create user object :-create new entry in the database
   //remove password and refresh token from respose
   //check for user creation 
   //return response

   const {username,email,fullName,password}=req.body // Destructuring the request body to get user details from frontend
   console.log("email",email);

   if([username,email,fullName,password].some((field)=>field?.trim()==="")){
      throw new ApiError(400,"All fields are required") 
   }

   //Check if user already exists
   const existedUser=User.findOne({
      $or:[{username},{email}] // Using $or operator to check if either username or email already exists in the database
   })

   if(existedUser){
      throw new ApiError(409,"User already exists with this username or email") // Throwing an error if user already exists
   }

  const avatarLocalPath= req.files?.avatar[0]?.path //req.files give access to the uploaded files, checking if avatar is uploaded,avatar[0] gives access to the first file in the avatar array, and path gives the path of the uploaded file

   const coverImageLocalPath= req.files?.coverImage[0]?.path
  
   if(!avatarLocalPath){
      throw new ApiError(400,"Avatar is required") // Throwing an error if avatar is not uploaded
   }

   const avatar=await uploadOnCloudinary(avatarLocalPath) // Uploading the avatar image to Cloudinary and awaiting the response
   const coverImage=await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
      throw new ApiError(400,"Avatar file is required")
   }

   //Creating user object
   const newUser= await User.create({
      username:username.toLowerCase(),
      email,
      fullName,
      avatar:avatar.url, // Storing the URL of the uploaded avatar image
      coverImage:coverImage?.url ||"", // Storing the URL of the uploaded cover image, if not uploaded, storing an empty string

      })

     const createdUser=await User.findById(newUser._id).select( //checking new user is created or not
         "-password -refreshToken" //password and refreshToken field are not selected 
     ) 

     if(!createdUser){
      throw new ApiError(500,"New User is not able to create")
     }

     return res.status(201).json(
      new ApiResponse(200,"User registration successfully") //new object of Apiresponse is created 
     )
} 
)

export {registerUser}