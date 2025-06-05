import upload from "../middlewares/multer.js"
import User from "../models/userModel.js"
import uploadOnCloudinary from "../config/cloudinary.js"; // ✅ Add this line


export const getCurrentUser = async (req,res) =>{
    try{
        let id = req.userId
        console.log(id)
     const user = await User.findById(req.userId).select('-password')
     if(!user){
        return res.status(400).json({msg:"user does not found"})
     }
     return res.status(200).json(user)
    }catch(err){
        console.log(err)
     return res.status(500).json({msg:"get current user Error"})
    }
}


export const updateProfile = async(req,res)=>{
    try{
      let{firstName,lastName,userName,headline,location,gender} = req.body

      //skills and education are array
      let skills = req.body.skills?JSON.parse(req.body.skills ):[]
      let education = req.body.education?JSON.parse(req.body.education ):[]
      let experience = req.body.experience?JSON.parse(req.body.experience ):[]
      
      let profileImage;
      let coverImage;
      
      if (req.files.profileImage) {
  try {
    profileImage = await uploadOnCloudinary(req.files.profileImage[0].path);
  } catch (cloudErr) {
    console.error("Cloudinary upload failed:", cloudErr.message);
  }
}
      if(req.files.coverImage){
        try{
          coverImage = await uploadOnCloudinary(req.files.coverImage[0].path)
        }catch(err){
             console.error("Cloudinary upload failed:", err.message);
        } 
      }

     let user = await User.findByIdAndUpdate(req.userId,{
        firstName,lastName,userName,headline,location,gender,skills,education,experience,profileImage,coverImage
     }).select('-password')
     return res.status(200).json(user)

    }catch(err){
      console.log(err)
      return res.status(500).json({msg:"update profile Error"})
    }
}