import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser=asyncHandler( async (req,res)=>{ // This is an example of an async function wrapped in asyncHandler
   return res.status(200).json({ // Sending a JSON response with status 200
    message:"ok"    
   })
})

export {registerUser}