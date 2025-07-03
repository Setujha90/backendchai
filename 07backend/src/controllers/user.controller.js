import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"; 
import {User} from "../models/user.model.js"; // Importing User model to interact with the user collection in the database
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { app } from "../index.js";
import bcrypt from "bcryptjs";

import mongoose from "mongoose";

//Create function to generate access and refresh token
const generateaccessandrefreshToken=async(user)=>{
   try{
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

const loginUser = asyncHandler(async (req, res) => {
   //Process for login
   //take username and password from fronted  //req.body->data
   //validate username and password          //username or email
   //check user exist in the database or not   //find the user 
                                              //password check
   //if valid user generate access and refresh token   
   //send these token to the cookies

   // const {username, email, password} = req.body
   // console.log("email",email);

   // if (!password) {
   //    throw new ApiError(400, "Password is required")
   // }

   // if (!(username || email)) {  //if both email and username field are blank
   //    throw new ApiError(400, "Email or username is required for login")
   // }

   // body: {
   //    entity: {
   //       indentifier: "Email or Username"
   //       data: "credentials"
   //    }
   //    password: "User Password"
   // }

   const {entity: {indentifier, data}, password} = req.body
   if(!indentifier || !data){
      throw new ApiError(400, "Email or username is required")
   }
   if(!password){
      throw new ApiError(400,"Password is required")
   }
   
   let user
   if(indentifier.toString().toLowerCase().trim() === "email") {
      user = await User.findOne({
         email: data
      })
   }
   else if(indentifier.toString().toLowerCase().trim() === "username") {
      user = await User.findOne({
         username: data
      })
   }

   if(!user){
      throw new ApiError(400, "Invalid credential")
   }

   const isvalidpassword = await bcrypt.compare(password, user.password)
   if(!isvalidpassword){
      throw new ApiError(400, "Invalid credential")
   }

   const {accessToken, refreshToken} = await generateaccessandrefreshToken(user)

   res.status(200)
   .cookie("accessToken", accessToken)
   .cookie("refreshToken", refreshToken)
   .json({
      message:"User successfullly logged in"
   })
   return;
}) 

// const loginUser = asyncHandler(async (req, res) => {
//    //Process for login
//    //take username and password from fronted  //req.body->data
//    //validate username and password          //username or email
//    //check user exist in the database or not   //find the user 
//                                               //password check
//    //if valid user generate access and refresh token   
//    //send these token to the cookies

//    // const {username, email, password} = req.body
//    // console.log("email",email);

//    // if (!password) {
//    //    throw new ApiError(400, "Password is required")
//    // }

//    // if (!(username || email)) {  //if both email and username field are blank
//    //    throw new ApiError(400, "Email or username is required for login")
//    // }
//    const {indentifier, password} = req.body
//    if (!indentifier) {  
//       throw new ApiError(400, "Email or username is required for login")
//    }

//    if (!password) {
//       throw new ApiError(400, "Password is required")
//    }
//    const user = await User.findOne({
//       $or: [{username:indentifier}, {email:indentifier}] 
//    })

//    if (!user) {
//       throw new ApiError(404, "User not found")
//    }

//    const isPasswordValid = await user.isPasswordCorrect(password)

//    if (!isPasswordValid) {
//       throw new ApiError(401, "Invalid credentials")
//    }

//    const {accessToken, refreshToken} = await generateaccessandrefreshToken(user._id)  // Generating access and refresh token for the user
//    const loggedInUser = await User.findById(user._id).select("-password -refreshToken") // Fetching the user details without password and refreshToken from the database
//    const options = { //optons are object that contains the options for the cookies
//       httpOnly: true,  //cookies can be modified by the server only, not by the client side scripts
//       secure: true
//    }

//    return res.status(200)
//    .cookie("accessToken", accessToken, options) // Setting the access token in the cookie with options
//    .cookie("refreshToken", refreshToken, options) // Setting the refresh token in the cookie with options
//    .json(
//       new ApiResponse(
//          200,
//          {
//             user: loggedInUser,
//             accessToken,
//             refreshToken
//          },
//          "User logged in successfully"
//       )
//    )
// }) 


const logoutUser=asyncHandler(async (req,res)=>{ 
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

const refreshAccessToken=asyncHandler( async(req,res)=>{
   const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken //getting the refresh token from the cookies or request body, if it is not present in both then it will be undefined
   if(!incomingRefreshToken){
      throw new ApiError(401,"Unauthorized request")
   }

   try {
      const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET) // decoding the refresh token using the secret key
      console.log("decodedToken",decodedToken) 
      const user= await User.findById(decodedToken?._id) // Finding the user by id from the decoded token, if user is not found then it will be null
      if(!user){
         throw new ApiError(401,"No valid refresh token")
      }
   
      if(incomingRefreshToken!=user?.refreshToken){ //checking if the incoming refresh token matches the one stored in the user document
         throw new ApiError(401,"Refresh token is expired or use")
      }
   
      const options={
         httpOnly:true,
         secure:true
      }

      const {accessToken, refreshToken}= await generateaccessandrefreshToken(user._id)

      return res.status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",refreshToken,options)
      .json(
         new ApiResponse(
            200,
            {
               accessToken, refreshToken
            },
            "Access Token refreshed successfully"
         )
      )
   } catch (error) {
      throw new ApiError(401,error?.message || "Invalid RefreshToken")

   }


})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldpassword: oldPassword, newpassword: newPassword } = req.body
    
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old password and new password are required")
    }

    const user = await User.findById(req.user?._id)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200)
        .json(new ApiResponse(200, {
        }, "Password changed successfully"))
})

const getCurrentUser=asyncHandler(async (req, res) => {
    const user= await User.findById(req.user._id).select("-password -refreshToken")

   return res.status(200)
       .json(new ApiResponse(200, {
           user
       }, "Current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
   const {fullName,email}=req.body
   if(!fullName || !email){
      throw new ApiError(400,"Full name and email are required")
   }

   // const user= await User.findById(req.user._id)
   // if(!user){
   //    throw new ApiError(404,"User not found")
   // }
   // user.fullName=fullName
   // user.email=email
   // await user.save({validateBeforeSave:false})

   //above code can be written in one more way
   const user= await User.findByIdAndUpdate(req.user._id, {
       $set: {
           fullName,
           email:email
         }
      },
      {
         new: true
      }
   ).select("-password -refreshToken") // Finding the user by id and updating the fullName and email, returning the updated user document without password and refreshToken   


   return res.status(200)
       .json(new ApiResponse(200, {
           user
       }, "Account details updated successfully"))
})


const updateUserAvatar = asyncHandler(async (req, res) => {
   
    if (!req.file || !req.file.path) { // Checking if the avatar file is uploaded and its path is available
      throw new ApiError(400, "Please provide an avatar image")
   }

    const avatarLocalPath = req.file.path // Getting the local path of the uploaded avatar image

   
    const avatar = await uploadOnCloudinary(avatarLocalPath) // Uploading the avatar image to Cloudinary and awaiting the response
   if (!avatar?.url) {
      throw new ApiError(400, "Error while uploading avatar on cloudinary")
   }

   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
            $set: { avatar: avatar.url } // Updating the user document with the new avatar URL
      },
      { new: true }
   ).select("-password -refreshToken")

   if (!user) {
      throw new ApiError(404, "User not found")
   }

   return res.status(200)
      .json(new ApiResponse(
            200,
            { user },
            "Avatar updated successfully"
      ))
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
   console.log("req.file", req.file) 
    if (!req.file || !req.file.path) {
        throw new ApiError(400, "Please provide a cover image")
    }

    const coverImageLocalPath = req.file.path

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!coverImage?.url) {
        throw new ApiError(400, "Error while uploading cover image on cloudinary")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { coverImage: coverImage.url }
        },
        { new: true }
    ).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res.status(200)
        .json(new ApiResponse(
            200,
            { user },
            "Cover image updated successfully"
        ))
})

const getUserChannelProfile = asyncHandler(async (req,res)=>{
   const {username} = req.params
   if(!username?.trim){
      throw new ApiError(400, "Username is missing")
   } 

   User.find({username}) // Finding the user by username,but we are not using it here
   const channel = await User.aggregate([
      {
         $match: {username: username.toLowerCase().trim()} // Matching the user by username, converting it to lowercase and trimming any whitespace
      },
      {
         $lookup: {
            from:"subscriptions", // Joining the subscriptions collection to get the subscribers of the channel
            localField:"_id", // Local field is the _id of the user document
            foreignField:"channel", // Foreign field is the channel field in the subscriptions collection
            as:"subscribers" // Joining the subscriptions collection to get the subscribers of the channel
         } 
      },
      {
         $lookup: {
            from:"subscriptions", 
            localField:"_id", 
            foreignField:"subscriber", // Foreign field is the subscriber field in the subscriptions collection
            as:"subscribedTo" // Joining the subscriptions collection to get the channels that the user is subscribed to
         }
      },
      {
         $addFields: {
            subscribersCount: { $size: "$subscribers" }, // Adding a new field subscribersCount to the user document which is the size of the subscribers array $subscribers is used because it is field now
            channelsSubscribedToCount: { $size: "$subscribedTo" },
            isSubscribed: {
               $cond: {
                  if: {$in: [req.user?._id, "$subscribers.subscriber"]}, // Checking if the user is subscribed to the channel
                  then: true, // If the user is subscribed to the channel, then isSubscribed is true
                  else: false // If the user is not subscribed to the channel, then isSubscribed is false
                  
               }
            }
               
                  
         }
      },
      {
         $project: { // Projecting the fields that we want to return in the response
            username: 1, // Including the username field in the response
            fullName: 1,
            subscribersCount: 1,
            channelsSubscribedToCount: 1,
            isSubscribed: 1,
            avatar: 1,
            coverImage: 1,
            email: 1
            //including the field as 1 means that we want to include this field in the response
         }
      }
   ])
   //console.log("channel", channel)
   if(!channel?.length){ //it means that channel length is 0,so channel is not found
      throw new ApiError(404,"Channel not found")
   } 
   return res.status(200).json(new ApiResponse(
      200,
      { channel: channel[0] },
      "Channel profile fetched successfully"
   ))


})

const getWatchHistory = asyncHandler(async (req, res)=>{
   const user = await User.aggregate([
      {
         $match: {_id: new mongoose.Types.ObjectId(req.user._id)} // Matching the user by id ,first converting the req.user._id to ObjectId type (in  this type it is store in the database)
      },
      {
         $lookup: {
            from: "videos", // Joining the videos collection to get the watch history of the user
            localField: "watchHistory", // Local field is the watchHistory field in the user document
            foreignField: "_id",
            as: "watchHistory", 
            pipeline: [  // Using pipeline to filter the videos and get only the required fields
               {
                  $lookup: { //nested lookup to get the owner of the video
                     from: "users",
                     localField: "owner",
                     foreignField: "_id",
                     as: "owner",
                     pipeline: [ // Using pipeline to filter the user and get only the required fields
                        {
                           $project: { // Projecting the fields that we want to return in the response in the owner field
                              fullName: 1,
                              username: 1,
                              avatar: 1
                           }
                        }
                     ]
                  }
               },
               {
                  $addFields: {
                     owner: {$arrayElemAt: ["$owner", 0]} // Adding a new field owner to the video document which is the first element of the owner array, because we are using $lookup to join the users collection and it returns an array of users, so we are taking the first element of the array
                  }
               }
            ]
         }
      }
   ])

   console.log("user", user) 

   // if(!user?.length || !user[0]?.watchHistory?.length){
   //    throw new ApiError(404,"Watch history not found")
   // }

   return res.status(200).json(new ApiResponse(
      200,
      { watchHistory: user[0].watchHistory }, // Returning the watch history of the user ,user[0] is used because we are using $match to match the user by id and it returns an array of users, so we are taking the first element of the array
      "Watch history fetched successfully"
   ))
})

export {registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,updateUserAvatar,updateUserCoverImage,getUserChannelProfile,getWatchHistory}