import express from 'express'
import isAuth from '../middlewares/isAuth.js'
import { getCurrentUser, updateProfile } from '../controllers/userController.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()

userRouter.get('/currentUser',isAuth,getCurrentUser)
userRouter.put('/updateProfile',isAuth,upload.fields([
   {name: "profileImage", maxCount: 1}, 
    {name: "coverImage", maxCount: 1}
]),updateProfile)

export default userRouter