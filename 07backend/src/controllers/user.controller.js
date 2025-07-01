import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"; // Importing ApiError for error handling
import {User} from "../models/user.model.js"; // Importing User model to interact with the user collection in the database
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

//Create function to generate access and refresh token
 const generateaccessandrefreshToken=async(userId)=>{
    try{
       const user= await User.findById(userId)
       const accessToken=user.generateAccessToken()
       const refreshToken=user.generateRefreshToken()
        user.refreshToken=refreshToken // Storing the refresh token in the user document in database
        await user.save({validateBeforeSave:false}) // Saving the user document with the new refresh token,validateBeforeSave:false means that the validation will not be performed before saving the document, which is useful when we are updating a field that does not require validation, like refreshToken in this case,we dont need password validation here
       return { accessToken, refreshToken }
    }catch(error){
        throw new ApiError(500,"Something went wrong while generating access and refresh token")
    }
   

 } 

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
 //  console.log("req.body",req.body) 
   const {username,email,fullName,password}=req.body // Destructuring the request body to get user details from frontend
  // console.log("email",email);

   if([username,email,fullName,password].some((field)=>field?.trim()==="")){
      throw new ApiError(400,"All fields are required") 
   }

   //Check if user already exists
   const existedUser=await User.findOne({
      $or:[{username},{email}] // Using $or operator to check if either username or email already exists in the database
   })

   if(existedUser){
      throw new ApiError(409,"User already exists with this username or email") // Throwing an error if user already exists
   }

  // console.log("req.files",req.files) 
  const avatarLocalPath= req.files?.avatar[0]?.path //req.files give access to the uploaded files, checking if avatar is uploaded,avatar[0] gives access to the first file in the avatar array, and path gives the path of the uploaded file

   //const coverImageLocalPath= req.files?.coverImage[0]?.path
   //we can write upper line with check if coverImage is exist or not
   let coverImageLocalPath;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
      coverImageLocalPath=req.files.coverImage[0].path // If cover image is uploaded, getting the path of the first file in the coverImage array
   }
  
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
      password,
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

const loginUser=asynHandle(async (req,res)=>{
   //Process for login
   //take username and password from fronted  //req.body->data
   //validate username and password          //username or email
   //check user exist in the database or not   //find the user 
                                              //password check
   //if valid user generate access and refresh token   
   //send these token to the cookies


   const {username,email,password}=req.body

   if(!(email || username)){  //if both email and username field are blank
      throw new ApiError(400,"Email or username is required for the login")
   }

  const user= await User.findOne({
      $or:[{username},{email}]
   })

   if(!user){
      throw new ApiError(404,"User not found")
   }

   const ispasswordvalid=await isPasswordCorrect(password)

   if(!ispasswordvalid){
      throw new ApiError(401,"Wrong password")
   }

   const {accessToken,refreshToken}= await generateaccessandrefreshToken(user._id) // Generating access and refresh token for the user

   const loggedInUser=await User.findById(user._id).select("-password -refreshToken") // Fetching the user details without password and refreshToken from the database

   //Now we will sending the cookies
   const options={ //Options is a object 
      httpOnly:true, //cookies can be modified by the server only, not by the client side scripts
      secure:true 
   }

   return res.status(200)
   .cookie("accessToken",accessToken,options) // Setting the access token in the cookies
   .cookie("refreshToken",refreshToken,options) // Setting the refresh token in the cookies
   .json(
      new ApiResponse(200,{
         user:loggedInUser,accessToken,refreshToken, // Sending the logged-in user details, access token, and refresh token in the response

      },
   "User logged in successfully" // Success message)
   )
)
}) 

const logoutUser=asyncHandler(async(req,res)=>{ 
   await User.findByIdAndUpdate(req.user._id ,{
       $set:{
         refreshToken:undefined // Setting the refresh token to undefined in the user document to log out the user
       }
   },
{
   new :true, // Returning the updated user document
})

  const options={
      httpOnly:true, // Cookies can be modified by the server only, not by the client side scripts
      secure:true, // Cookies will only be sent over HTTPS}
  }

  return res.status(200)
  .clearCookie("accessToken",options) // Clearing the access token cookie
   .clearCookie("refreshToken",options) // Clearing the refresh token cookie
   .json(new ApiResponse(200,{},"User logged out successfully")) // Sending a success message in the response
})



export {registerUser,loginUser,logoutUser} 