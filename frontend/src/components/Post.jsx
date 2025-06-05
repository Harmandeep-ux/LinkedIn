import React, { useEffect, useState } from "react";
import dp from "../assets/blank-profile-picture-973460_960_720.webp";
import moment from "moment";
import { AiTwotoneLike } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import axios from "axios";
import { useContext } from "react";
import AuthContext, { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import { IoMdSend } from "react-icons/io";
import {io} from "socket.io-client"
import ConnectionButton from "../components/ConnectionButton";

let socket = io('http://localhost:8000')
const Post = ({ id, author, like, comment, description, image, createdAt }) => {
  let { serverUrl } = useContext(authDataContext);
  let { userData, setUserData, getPost } = useContext(userDataContext);

  const [more, setMore] = useState(false);
  const [likes, setLikes] = useState(like || []);
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState(comment || []);
  const [showComment, setShowComment] = useState(false)

  const handleLike = async () => {
    try {
      let result = await axios.get(serverUrl + `/api/post/like/${id}`, {
        withCredentials: true,
      });
      console.log(result.data);
      setLikes(result.data.like);
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      let result = await axios.post(
        serverUrl + `/api/post/comment/${id}`,
        { content: commentContent },
        { withCredentials: true }
      );
      
      setComments(result.data.comment);
      setCommentContent("");
    } catch (err) {
      console.log(err);
    }
  };

 useEffect(()=>{
  socket.on('likeUpdated',({postId,likes})=>{
    if(postId==id){
      setLikes(likes)
    }
  })
   socket.on('commentAdded', ({ postId, comm }) => {
  if (postId == id) {
    setComments(prev => [...prev, comm]);
  }
});
  return ()=>{
    socket.off("likeUpdated")
    socket.off("commentAdded")
  }
 },[id])

  useEffect(() => {
    getPost;
  }, [likes, setLikes, comments]);

  return (
    <div className="w-full min-h-[200px] bg-white shadow-lg rounded-lg p-[20px] flex flex-col gap-[10px] mb-6">
      {/* Post header */}
      <div className="flex justify-between">
        <div className="flex justify-center items-start gap-[10px]">
          <div className="w-[50px] h-[50px] rounded-full overflow-hidden items-center justify-center">
            <img
              src={author.profileImage || dp}
              alt=""
              className="h-full w-full object-cover cursor-pointer"
            />
          </div>

          <div>
            <div className="text-[18px] font-semibold text-gray-800">
              {`${author.firstName} ${author.lastName}`}
            </div>
            <div className="text-[14px] text-gray-600">
              {author.headline}
            </div>
            <div className="text-[12px] text-gray-500">
              {moment(createdAt).fromNow()}
            </div>
          </div>
        </div>
        {userData._id!=author._id && <ConnectionButton userId={author._id}/>
}
      </div>

      {/* Post content */}
      <div className={`w-full ${!more ? "max-h-[100px] overflow-hidden" : ""} pl-[60px]`}>
        {description}
      </div>
      <div
        className="pl-[60px] text-[16px] font-semibold cursor-pointer text-blue-600 hover:text-blue-800"
        onClick={() => setMore((prev) => !prev)}
      >
        {more ? "Read less" : "Read more..."}
      </div>
      
      {image && (
        <div className="w-full max-h-[500px] flex justify-center overflow-hidden rounded-lg mt-2">
          <img src={image} alt="" className="w-full h-full object-contain" />
        </div>
      )}
      
      {/* Like/comment stats */}
      <div className="flex justify-between items-center px-4 py-2 border-t border-b border-gray-200 text-gray-600">
        <div className="flex items-center gap-1">
          <AiTwotoneLike className="text-[#1ebbff] w-5 h-5" />
          <span>{likes.length}</span>
        </div>
        <div className="flex items-center gap-1 cursor-pointer" onClick={()=>setShowComment(prev=>!prev)}>
          <BiCommentDetail className="w-5 h-5" />
          <span>{comments.length} comments</span>
        </div>
      </div>
      
      {/* Like/comment actions */}
      <div className="flex justify-around items-center py-2 border-b border-gray-200">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-1 px-4 py-1 rounded-md hover:bg-gray-100 ${
            likes.includes(userData._id) ? "text-blue-600 font-medium" : "text-gray-600"
          }`}
        >
          <AiTwotoneLike className="w-5 h-5" />
          <span>{likes.includes(userData._id) ? "Liked" : "Like"}</span>
        </button>
        <button onClick={()=>setShowComment(prev=>!prev)} className="flex items-center gap-1 px-4 py-1 rounded-md hover:bg-gray-100 text-gray-600">
          <BiCommentDetail className="w-5 h-5" />
          <span>Comment</span>
        </button>
      </div>
      
      {/* Comment input */}
      <form
        onSubmit={handleComment}
        className="flex items-center gap-2 p-2 border-b border-gray-200"
      >
        <img 
          src={userData.profileImage || dp} 
          alt="User" 
          className="w-8 h-8 rounded-full object-cover" 
        />
        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
          <input
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            type="text"
            placeholder="Write a comment..."
            className="w-full bg-transparent outline-none border-none text-gray-800"
          />
          <button 
            type="submit" 
            disabled={!commentContent.trim()}
            className={`ml-2 ${commentContent.trim() ? "text-blue-600" : "text-gray-400"}`}
          >
            <IoMdSend className="w-5 h-5" />
          </button>
        </div>
      </form>
      
      {/* Comments list */}
      {showComment && <div className="space-y-3 mt-2">
        {comments.map((com) => (
          <div key={com._id} className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <img
                src={com.user?.profileImage || dp}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {`${com.user?.firstName} ${com.user?.lastName}`}
                </span>
                <span className="text-xs text-gray-500">
                  {moment(com.createdAt).fromNow()}
                </span>
              </div>
              <div className="mt-1 text-gray-800">{com.content}</div>
            </div>
          </div>
        ))}
      </div>}
      
    </div>
  );
};

export default Post;