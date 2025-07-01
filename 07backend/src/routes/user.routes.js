import {Router} from "express"
import { registerUser,loginUser,logoutUser} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router=Router()

router.post('/register', upload.fields([  // Using multer middleware to handle file uploads, allowing multiple files with specified field names ,jaate jaate middleware se mil ke jana h
    { name: 'avatar', maxCount: 1 }, //accepting the avatar image with a maximum count of 1
     { name: 'coverImage', maxCount: 1 }])
     , registerUser)

router.route('/login').post(loginUser) // Login route

router.route('/logout').post(verifyJWT, logoutUser) //we inject verifyJWT middleware to check if user is login aur not,if user is not login then it will throw an error and will not proceed to logoutUser controller if user is login then it will proceed to logoutUser controller
export {router as userRouter}