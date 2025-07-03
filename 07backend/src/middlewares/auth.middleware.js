import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";  

//we are going to create our own middleware to verify JWT token ,whether user is authenticated or not
export const verifyJWT = asyncHandler(async (req, res, next) =>{ 
      try {
         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");  //req have access of cookies because we have used cookie-parser middleware in index.js file so we access the accessToken from the cookies//req.header("Authorization")?.replace("Bearer ", "") is used to get the token from the Authorization header if it is present, replacing "Bearer " with an empty string to extract just the token part. This is useful for APIs that use Bearer token authentication.
  
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
           //verifying the token
          const decodedToken= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  
           const user= await User.findById(decodedToken?._id).select("-password -refreshToken"); //finding the user by id and excluding password and refreshToken fields from the result
  
              if(!user){
                  throw new ApiError(401,"Invalid Access Token")
              }
  
              req.user = user; //attaching the user to the request object so that it can be accessed in the next middleware or route handler
              next();
      } catch (error) {
        throw new ApiError(
            401, 
            error?.message || "Invalid access token"
        ) //if any error occurs, throw an ApiError with status code 401 and the error message
        
      }
})