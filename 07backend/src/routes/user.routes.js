import {Router} from "express"
import { registerUser,loginUser,logoutUser,refreshAccessToken} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router=Router()

router.post('/register', upload.fields([  // Using multer middleware to handle file uploads, allowing multiple files with specified field names ,jaate jaate middleware se mil ke jana h
    { name: 'avatar', maxCount: 1 }, //accepting the avatar image with a maximum count of 1
     { name: 'coverImage', maxCount: 1 }])
     , registerUser)

router.route('/login').post(loginUser) // Login route

//secured routes
router.route('/logout').post(verifyJWT, logoutUser) //we inject verifyJWT middleware to check if user is login aur not,if user is not login then it will throw an error and will not proceed to logoutUser controller if user is login then it will proceed to logoutUser controller

router.route('/refresh-token').post(refreshAccessToken) // Route to refresh access token, no need to verifyJWT middleware here because we are going to check the refresh token in the controller itself,it is like hitting the endpoint to get a new access token using the refresh token
export {router as userRouter}