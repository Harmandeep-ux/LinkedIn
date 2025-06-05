import uploadOnCloudinary from "../config/cloudinary.js"
import { io } from "../index.js";
import Post from "../models/postModel.js"

export const createPost = async(req,res) =>{
    try{
    const {description} = req.body
    let newPost;
    
    if(req.file){
        let image = await uploadOnCloudinary(req.file.path)
        newPost = await Post.create({
            author: req.userId,
            description,
            image
        })
    }else{
         newPost = await Post.create({
         author: req.userId,
            description
        })
    }

    return res.status(201).json(newPost)
    }catch(err){
        return res.status(500).json(`create Post error ${err}`)
    }
}

export const getPost =  async(req,res)=>{
  try{
    let post = await Post.find().populate('author','firstName lastName profileImage headline')
     .populate('comment.user','firstName lastName profileImage headline')
    .sort({createdAt:-1})
    return res.status(200).json(post)
  }catch(err){
    return res.status(500).json({msg:'unable to get posts'})
  }
} 

export const like = async (req,res)=>{
    try{
       let postid = req.params.id 
       let userId = req.userId

       let post = await Post.findById(postid)
       if(!post){
        return res.status(400).json({msg:"post not found"})
       }
       //pher user id push krdo and check kro user ne alreadu like ta nhi kita
      if(post.like.includes(userId)){
        post.like=post.like.filter((id)=>id!=userId)
      }else{
          post.like.push(userId)
      }
      await post.save()
     //io.emit naal bhejna frontend te acess krna
      io.emit("likeUpdated",{postid,likes:post.like})


      res.status(200).json(post)
    }catch(err){
        return res.status(500).json({msg:'like error'})
    }
}

export const comment = async(req,res)=>{
    try{
    let postId = req.params.id
    let userId = req.userId
    //frontend toh content,user auna as defined in post Model commnet array
    let {content} = req.body

    let post = await Post.findByIdAndUpdate(postId,{
        $push:{comment:{content,user:userId}}
    },{new:true})
    .populate("comment.user","firstName lastName profileImage headline")
    .sort({createAt:-1})
    io.emit("commentAdded",{postId,comm:post.comment})
     return res.status(200).json(post)
    }catch(err){
        return res.status(400).json({msg:"comment error"})
    }
}