import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const router=Router()

router.post('/register', upload.fields([  // Using multer middleware to handle file uploads, allowing multiple files with specified field names ,jaate jaate middleware se mil ke jana h
    { name: 'avatar', maxCount: 1 }, //accepting the avatar image with a maximum count of 1
     { name: 'coverImage', maxCount: 1 }])
     , registerUser)


export {router as userRouter}