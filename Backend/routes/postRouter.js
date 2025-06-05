import express from 'express'
import isAuth from '../middlewares/isAuth.js'
import upload from '../middlewares/multer.js'
import { comment, createPost, getPost, like } from '../controllers/postControllers.js'

const postRouter = express.Router()

postRouter.post('/create',isAuth,upload.single('image'),createPost)
postRouter.get('/getpost',isAuth,upload.single('image'),getPost)
postRouter.get('/like/:id',isAuth,upload.single('image'),like)
postRouter.post('/comment/:id',isAuth,upload.single('image'),comment)

export default postRouter