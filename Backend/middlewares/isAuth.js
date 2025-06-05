import jwt from 'jsonwebtoken'

const isAuth = async (req,res,next) =>{
    try{
      let token =  req.cookies.token
      if(!token){
        return res.status(400).json({msg:'user doesnot have token'})
      }
      const verifyToken =  jwt.verify(token,process.env.JWT_SECRET)
      if(!verifyToken){
                return res.status(400).json({msg:'user doesnot valid  token'})
      }
    //   console.log(verifyToken)
      req.userId = verifyToken.userId
      next()
    }catch(err){
        return res.status(500).json({msg:"is auth error"})
    }
}

export default isAuth;