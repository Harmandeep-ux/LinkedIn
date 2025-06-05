import generateToken from "../config/token.js"
import User from "../models/userModel.js"
import bcrypt from 'bcryptjs'

export const signUp = async(req,res)=>{
    try{
       const {firstName,lastName,userName,email,password,} = req.body 

       let existingEmail = await User.findOne({email})
       if(existingEmail){
        return res.status(400).json({msg:"email already exists"})
       }
       let existingUsername = await User.findOne({email})
       if(existingUsername){
        return res.status(400).json({msg:"Username already exists"})
       }
       if(password.length <8){
                return res.status(400).json({msg:"password must contain 8 characters"})

       }

       const hashPassword =await bcrypt.hash(password,10)

       const user = await User.create({
        firstName,
        lastName,
        userName,
        email,
        password:hashPassword,
       })
         
       let token = await generateToken(user._id)
       res.cookie('token',token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        sameSite:"strict",
        secure:process.env.NODE_ENVIRONMENT === "production"
       })
       res.status(201).json(user)

    }catch(err){ 
        console.log(err)
     return res.status(500).json({msg:"signUp error"})
     
    }
}
export const login = async(req,res)=>{
    try{
    const {email,password} = req.body
    
    let user = await User.findOne({email})

    if(!user){
        return res.status(400).json({msg:'user doesnot exist'})
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({msg:"invalid credentials"})
    }

    let token = await generateToken(user._id)
       res.cookie('token',token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        sameSite:"strict",
        secure:process.env.NODE_ENVIRONMENT === "production"
       })
            return res.status(200).json(user)

    
    }catch(err){
   console.log(err)
     return res.status(500).json({msg:"login error"})
    }
}

export const logOut = async(req,res)=>{
try{
 res.clearCookie('token')
 return res.status(200).json({msg:"logout succesfully"})
}catch(err){
 return res.status(500).json({msg:"logout error"})
}
}