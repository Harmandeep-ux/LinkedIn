import React, { useContext, useState, useRef } from "react";
import { FaRegImage } from "react-icons/fa6";
import Nav from "../components/Nav";
import dp from "../assets/blank-profile-picture-973460_960_720.webp";
import { FiCamera, FiPlus } from "react-icons/fi";
import { IoIosCamera } from "react-icons/io";
import { userDataContext } from "../context/UserContext";
import { IoPencil } from "react-icons/io5";
import EditProfile from "../components/EditProfile";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import Post from "../components/Post";

const Home = () => {
  let image = useRef();
  let [description, setDescription] = useState("");
  let [frontendImage, setFrontendImage] = useState("");
  let [backendImage, setBackendImage] = useState("");
  let { userData, setUserData, edit, setedit,postData,setPostData } = useContext(userDataContext);
  let {serverUrl} = useContext(authDataContext)
  const [uploadPost, setuploadPost] = useState(false);
  const [loading, setloading] = useState()

  function handleImage(e) {
    let file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  }

  async function handleUploadPost(){
    try{ 
    let formData = new FormData()
    formData.append('description',description)

    if(backendImage){
      formData.append('image',backendImage)
    }
    setloading(true)
    let result = await axios.post(serverUrl+'/api/post/create',formData,{withCredentials:true})
    console.log(result)
    setloading(false)
    setuploadPost(false )
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className="w-full min-h-[100vh] bg-[#f0efe7] pt-[100px] pb-[50px] flex items-center lg:items-start justify-center gap-[20px] px-[20px] flex-col lg:flex-row relative">
      {edit && <EditProfile />}

      <Nav />
      <div className="w-full lg:w-[25%] min-h-[200px] bg-white shadow-lg rounded-lg relative ">
        <div className="w-[100%] h-[100px] bg-gray-400 rounded overflow-hidden flex items-center justify-center">
          <img src={userData.coverImage || ""} alt="" className="w-full" />
          <IoIosCamera
            onClick={() => setedit(true)}
            className="absolute right-[20px] top-[20px] w-[25px] text-gray-800 h-[25px] cursor-pointer"
          />
        </div>
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden items-center justify-center absolute top-[65px] left-[35px]">
          <img
            onClick={() => setedit(true)}
            src={userData.profileImage || dp}
            alt=""
            className=" h-full cursor-pointer"
          />
        </div>
        <div className="w-[20px] h-[20px] bg-[#17c1ff] absolute top-[100px] left-[90px] rounded-full flex items-center justify-center">
          <FiPlus className="cursor-pointer text-white" />
        </div>

        {/* details */}
        <div className="mt-[30px] pl-[20px] text-[19px] font-semibold text-gray-700">
          <div>{`${userData.firstName} ${userData.lastName}`}</div>
          <div className="pl-[20px] text-[19px] font-semibold text-gray-700">{`${
            userData.headline || ""
          } `}</div>
          <div className="pl-[20px] text-[16px] font-semibold text-gray-700">
            {userData.location}
          </div>
          <button
            onClick={() => setedit(true)}
            className="w-[100%] h-[40px] flex items-center justify-center ml-[-10px] mt-[50px] my-[30px] rounded-full border-2 border-[#2dc0ff] gap-[10px] text-[#2dc0ff]"
          >
            Edit Profile
            <IoPencil />
          </button>
        </div>
      </div>

      {uploadPost && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-[100] flex items-center justify-center">
          <div className="w-[90%] max-w-[500px] h-[550px] bg-white shadow-lg rounded-lg relative z-[200] p-6">
            {/* Close Button */}
            <div className="absolute right-5 top-5 cursor-pointer">
              <RxCross1
                onClick={() => setuploadPost(false)}
                className="w-6 h-6 text-gray-800 font-bold"
              />
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4 mt-10 mb-4">
              <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
                <img
                  src={userData.profileImage || dp}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-[20px] font-semibold text-gray-800">
                {`${userData.firstName} ${userData.lastName}`}
              </div>
            </div>

            {/* Text Area */}
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className={`w-full ${frontendImage}h-[200px] border border-gray-300 rounded-lg p-3 text-[16px] resize-none focus:outline-none focus:ring-2 focus:ring-[#24b2ff]`}
              placeholder="What do you want to talk about?"
            ></textarea>

            {/* image icon */}
            <div className="w-full h-[200px] flex flex-col">
              <div className="p-[20px] flex items-center justify-start">
                <FaRegImage
                  onClick={() => image.current.click()}
                  className="w-[24px] h-[24px] text-gray-600"
                />
              </div>
              <input type="file" ref={image} hidden onChange={handleImage} />
              <div>
                <img src={frontendImage || "no image"} alt="" />
              </div>
              <div className="flex justify-end items-center">
                <button
                onClick={handleUploadPost}
                className="mt-6 w-[100px] h-[50px] bg-[#24b2ff] text-white rounded-full font-semibold hover:bg-[#1a9ddb] transition-all duration-200">
                 {loading?"....posting":"post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2 */}
      <div className="w-full lg:w-[50%] flex flex-col gap-[20px] shadow-lg">
        <div className="w-full h-[120px] bg-white shadow-lg rounded-lg flex items-center justify-center gap-[10px]">
          <div className="w-[70px] h-[70px] rounded-full overflow-hidden items-center justify-center cursor-pointer ">
            <img
              src={userData.profileImage || dp}
              alt=""
              className=" h-full cursor-pointer"
            />
          </div>
          <button
            onClick={() => setuploadPost(true)}
            className="w-[80%] h-[50px] border-2 border-gray-500 rounded-full flex items-center justify-start px-[20px] hover:bg-gray-200 "
          >
            Start a post
          </button>
        </div>
        {postData.map((post,index)=>(
        <Post key={index} id={post._id}
         description={post.description}
         author={post.author}
         image={post.image}
         like={post.like}
         comment={post.comment}
         headline={post.headline}
         createdAt={post.createdAt}/>
        ))}
      </div>

      <div className="w-full lg:w-[25%] min-h-[200px] bg-white shadow-lg"></div>
    </div>
  );
};

export default Home;
