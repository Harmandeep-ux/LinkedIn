import React, { useContext, useRef, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { userDataContext } from "../context/UserContext";
import dp from "../assets/blank-profile-picture-973460_960_720.webp";
import { FiPlus } from "react-icons/fi";
import { IoIosCamera } from "react-icons/io";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";


const EditProfile = () => {
  let { userData, setUserData, edit, setedit } = useContext(userDataContext);
  let {serverUrl} = useContext(authDataContext)
  const [firstName, setfirstName] = useState(userData.firstName || "")
  const [lastName, setLastName] = useState(userData.lastName || "")
  const [userName, setUserName] = useState(userData.userName || "")
  const [location, setLocation] = useState(userData.location || "")
  const [headline, setHeadline] = useState(userData.headline || "")
  const [gender, setgender] = useState(userData.gender || "")
  const [skills, setSkills] = useState(userData.skills || [])
  const [newSkills, setNewSkills] = useState("")
  const [education,setEducation] = useState(userData.education || [])
  const [newEducation,setNewEducation] = useState({
                college:'',
                degree:'',
                fieldOfStudy:''
                
            })
  const [experience,setExperience] = useState(userData.experience || [])
  const [newExperience, setNewExperience] = useState({
            title:'',
            company:'',
            description:''
        })          
  const [frontendProfileImage,setFrontendProfileImage] = useState(userData.profileImage|| dp)
  const [backendProfileImage,setbackendProfileImage] = useState(null)
  const [frontendCoverImage,setfrontendCoverImage] = useState(userData.coverImage || null)
  const [backendCoverImage,setbackendCoverImage] = useState(null)
  const [saving, setSaving] = useState(false)

  

  
function addSkill(){
  if(newSkills && !skills.includes(newSkills)){
    setSkills([...skills,newSkills])
  }
  setNewSkills('')
}

function removeSkill(skill){
  if(skills.includes(skill)){
   setSkills(skills.filter((s)=>s!==skill))
  }
}

function addEducation(){
 if(newEducation.college && newEducation.degree && newEducation.fieldOfStudy) {
   setEducation([...education,newEducation])
 } 
  setNewEducation({
    college:"",
    degree:"",
    fieldOfStudy:''
  })
}

function removeEducation(edu){
  if(education.includes(edu)){
   setEducation( education.filter((e)=>e!==edu))
  }
}

function addExperience(){
  if(newExperience.company && newExperience.title  && newExperience.description){
    setExperience([...experience,newExperience])
  }
  setNewExperience({
    title:'',
    company:'',
    description:''
  })
}

function removeExperience(exp){
  if(experience.includes(exp)){
   setExperience(experience.filter((e)=>e!==exp))
  }
}

function handleProfileImage(e){
//jo v select kita ohnu file vich set laina
let file = e.target.files[0]
setbackendProfileImage(file)
setFrontendProfileImage(URL.createObjectURL(file))
}
function handleCoverImage(e){
//jo v select kita ohnu file vich set laina
let file = e.target.files[0]
  setbackendCoverImage(file); // ✅ correct
  setfrontendCoverImage(URL.createObjectURL(file));
}

const profileImage = useRef()
const coverImage = useRef()


const handleSaveProfile = async()=>{
  setSaving(true)
  try{
   let formData = new FormData()
   formData.append('firstName',firstName)
   formData.append('lastName',lastName)
   formData.append('userName',userName)
   formData.append('headline',headline)
   formData.append('location',location)
   formData.append('skills',JSON.stringify(skills))
   formData.append('education',JSON.stringify(education))
   formData.append('experience',JSON.stringify(experience))

   if(backendProfileImage){
    formData.append('profileImage',backendProfileImage)
   }
   if(backendCoverImage){
    formData.append('coverImage',backendCoverImage)
   }
   let result = await axios.put(`${serverUrl}/api/user/updateProfile`,formData,
    {withCredentials:true})
    console.log(result)
    setUserData(result.data)
    setSaving(false)
    setedit(false)
  }catch(err){
   console.log(err)

  }
}

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[100] flex items-center justify-center">

      <input type="file" accept="/image/*" hidden ref={profileImage} onChange={handleProfileImage}/>
      <input type="file" accept="/image/*" hidden ref={coverImage} onChange={handleCoverImage}/>
      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

      {/* Modal */}
      <div className="relative z-[110] w-[90%] max-w-[500px] h-[600px] overflow-auto bg-white shadow-lg rounded-lg p-4">
        {/* Close Button */}
        <div className="absolute right-[20px] top-[20px] cursor-pointer">
          <RxCross1
            onClick={() => setedit(false)}
            className="w-[25px] h-[25px] text-gray-800 font-bold"
          />
        </div>

        {/* Content Placeholder */}
        <div 
        onClick={()=>coverImage.current.click()}
        className="mt-[40px] rounded-lg w-full h-[150px] text-center bg-gray-500 text-gray-700 font-semibold">
          <img src={frontendCoverImage} alt="Cover" />
          <IoIosCamera
            onClick={() => setedit(true)}
            className="absolute right-[20px] top-[60px] w-[25px] text-gray-800 h-[25px] cursor-pointer"
          />
        </div>
        <div onClick={()=>profileImage.current.click()} className="w-[80px] h-[80px] cursor-pointer rounded-full overflow-hidden absolute top-[150px] ml-[20px]">
          <img src={frontendProfileImage} alt="Profile" className="w-full h-full" />
        </div>
        <div className="w-[20px] h-[20px] bg-[#17c1ff] absolute top-[200px] left-[100px] rounded-full flex items-center justify-center">
          <FiPlus className="cursor-pointer text-white" />
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-[20px] mt-[50px] ">
            <input type="text" placeholder="firstName" value={firstName} onChange={(e)=> setfirstName(e.target.value)}
            className="w-full p-2 h-[50px] outline-none border-gray-600 px-[10px py-[5px] text-[18px] border-2 rounded-lg" />
            <input type="text" placeholder="lastName" value={lastName} onChange={(e)=> setLastName(e.target.value)}
            className="w-full p-2 h-[50px] outline-none border-gray-600 px-[10px py-[5px] text-[18px] border-2 rounded-lg"/>
            <input type="text" placeholder="userName" value={userName} onChange={(e)=> setUserName(e.target.value)}
            className="w-full p-2 h-[50px] outline-none border-gray-600 px-[10px py-[5px] text-[18px] border-2 rounded-lg"/>
            <input type="text" placeholder="headline" value={headline} onChange={(e)=> setHeadline(e.target.value)}
            className="w-full p-2 h-[50px] outline-none border-gray-600 px-[10px py-[5px] text-[18px] border-2 rounded-lg"/>
            <input type="text" placeholder="location" value={location} onChange={(e)=> setLocation(e.target.value)}
            className="w-full h-[50px] outline-none border-gray-600 px-[10px py-[5px] text-[18px] border-2 rounded-lg"/>
            <input type="text p-2" placeholder="gender (male,female,other)" value={gender} onChange={(e)=> setgender(e.target.value)}
            className="w-full h-[50px] outline-none border-gray-600 px-[10px py-[5px] text-[18px] border-2 rounded-lg"/>
          
            <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg">
                <h1 className="text-[19px] font-semibold">Skills</h1>
                {skills && <div className="flex flex-col gap-[10px]">
                  {skills.map((skill,index)=>(
                    <div key={index} className="w-full flex justify-between items-center h-[40px] border-[1px] border-gray-600 bg-gray-200 rounded-lg p-[10px]">
                      <span>{skill}</span>
                       <RxCross1 
                       onClick={()=>removeSkill(skill)}
                       className="w-[20px] h-[20px] text-gray-800 font-bold cursor-pointer"
          />
                    </div>
                  ))}
                  </div>}
                  {/* add krdo skills je haini koi */}
                  <div
                  className="flex flex-col gap-[10px] items-start">
                    <input type="text p-2" placeholder="add new Skills" value={newSkills} onChange={(e)=>setNewSkills(e.target.value)}
                    className="w-full h-[50px] outline-none border-gray-600 px-[10px py-[5px] text-[16px] border-2 rounded-lg"/>
                    <button
                    onClick={addSkill}
                    className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]'>Add</button>
                  </div>
            </div>
            <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg">
                <h1 className="text-[19px] font-semibold">Education</h1>
                {education && <div className="flex flex-col gap-[10px]">
                  {education.map((edu,index)=>(
                    <div key={index} className="w-full flex justify-between items-center  border-[1px] border-gray-600 bg-gray-200 rounded-lg p-[10px]">
                      <div>
                        <div>College: {edu.college}</div>
                        <div>Degree: {edu.degree}</div>
                        <div>Field of Study: {edu.fieldOfStudy}</div>
                      </div>
                       <RxCross1 
                       onClick= {()=>removeEducation(edu)}
                        className="w-[20px] h-[20px] text-gray-800 font-bold cursor-pointer"
                      />
                    </div>
                  ))}
                  </div>}
                  {/* add krti education */}

                  <div
                  className="flex flex-col gap-[10px] items-start">

                    <input type="text p-2" placeholder="college" value={newEducation.college} onChange={(e)=>setNewEducation({...newEducation,college:e.target.value})}
                    className="w-full p-2 h-[50px] outline-none border-gray-600 px-[10px py-[5px] text-[16px] border-2 rounded-lg"/>

                    <input type="text" placeholder="degree" value={newEducation.degree} onChange={(e)=>setNewEducation({...newEducation,degree:e.target.value})}
                    className="w-full p-2 h-[50px] outline-none border-gray-600 px-[10px py-[5px] text-[16px] border-2 rounded-lg"/>

                    <input type="text" placeholder="field of study" value={newEducation.fieldOfStudy} onChange={(e)=>setNewEducation({...newEducation,fieldOfStudy:e.target.value})}
                    className="w-full p-2 h-[50px] outline-none border-gray-600 px-[10px py-[5px] text-[16px] border-2 rounded-lg"/>
                    <button
                    onClick={addEducation}
                    className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]'>Add</button>

                  </div>
            </div>

{/* EXPERIENCE */}
            <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg">
                <h1 className="text-[19px] font-semibold">Experience</h1>
                {experience && <div className="flex flex-col gap-[10px]">
                  {experience.map((exp,index)=>(
                    <div key={index} className="w-full flex justify-between items-center  border-[1px] border-gray-600 bg-gray-200 rounded-lg p-[10px]">
                      <div>
                        <div>title: {exp.title}</div>
                        <div>Company: {exp.company}</div>
                        <div>Description: {exp.description}</div>
                      </div>
                       <RxCross1 
                      onClick={()=>removeExperience(exp)}
                        className="w-[20px] h-[20px] text-gray-800 font-bold cursor-pointer"
          />
                    </div>
                  ))}
                  </div>}
                  {/* add krta experience */}

                  <div
                  className="flex flex-col gap-[10px] items-start">

                    <input type="text" placeholder="title" value={newExperience.title} onChange={(e)=>setNewExperience({...newExperience,title:e.target.value})}
                    className="w-full p-2 h-[50px] outline-none border-gray-600 px-[10px py-[5px] text-[16px] border-2 rounded-lg"/>

                    <input type="text" placeholder="company" value={newExperience.company} onChange={(e)=>setNewExperience({...newExperience,company:e.target.value})}
                    className="w-full p-2 h-[50px] outline-none border-gray-600 px-[10px py-[5px] text-[16px] border-2 rounded-lg"/>

                    <input type="text" placeholder="field of study" value={newExperience.description} onChange={(e)=>setNewExperience({...newExperience,description:e.target.value})}
                    className="w-full p-2 h-[50px] outline-none border-gray-600 px-[10px py-[5px] text-[16px] border-2 rounded-lg"/>
                    <button
                    onClick={addExperience}
                    className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]'>Add</button>

                  </div>
            </div>

            <button 
            onClick={handleSaveProfile}
            className='text-white bg-[#24b2ff] mt-[40px] h-[50px] w-full  flex items-center justify-center rounded-full' disabled={saving}>{saving ? 'saving...': "save Profile"}</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
