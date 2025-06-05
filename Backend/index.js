import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import authRouter from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from './routes/userRoutes.js'
import postRouter from './routes/postRouter.js'
import connectionRouter from './routes/connectionRoutes.js'
import http from 'http'
import { Server } from 'socket.io'
dotenv.config()

const app = express()
let server = http.createServer(app)
export const io= new Server(server,{
    cors:({
    origin:"http://localhost:5173",
    credentials:true
})
})
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
let port = process.env.PORT || 5000 //if no port in dotenv then simply run on 5000

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/post',postRouter)
app.use('/api/connection',connectionRouter)

export const userSocketMap =new Map()
io.on("connection",(socket)=>{
    console.log("user Connected",socket.id)
    socket.on("register",(userId)=>{
        userSocketMap.set(userId,socket.id)
    })
    socket.on('disconnect',(socket)=>{
        console.log("User disconnected",socket._id)
    })
})

//connection function runs when connection with frontend

server.listen(port,()=>{
    connectDb()
    console.log(`server started on ${port}`);
})