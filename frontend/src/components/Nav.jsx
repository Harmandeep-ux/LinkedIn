import React, { useContext, useState } from 'react'
import logo from '../assets/logo.svg'
import { IoSearch } from "react-icons/io5";
import { IoIosHome } from "react-icons/io";
import { FaUserGroup } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import dp from '../assets/blank-profile-picture-973460_960_720.webp'
import { userDataContext } from '../context/UserContext';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'


const Nav = () => {

  let navigate = useNavigate()

    const [active, setactive] = useState(false)
    let {userData, setUserData} = useContext(userDataContext)
    
    const [showPopUp, setShowPopUp] = useState(false)

    let {serverUrl} = useContext(authDataContext)

    const handleSignOut = async () =>{
      try{
       let result = await axios.get(serverUrl+'/api/auth/logout',
        {
        withCredentials:true        
       })
       setUserData(null)
       navigate('/login')
       console.log(result)
      }catch(err){
      console.log(err)
      }
    }

  return (
    <div className='w-full h-[80px] bg-white fixed top-0 left-0 z-[80] shadow-lg flex items-center md:justify-around justify-between px-[10px]'>
      
        <div className='flex justify-center items-center gap-[10px]'>
        <div onClick={()=> setactive(false)}>
            <img src={logo} alt="" className='w-[50px] ' />
        </div>
        {!active && <div><IoSearch className='w-[23px] h-[23px] text-gray-700 flex lg:hidden' onClick={()=>setactive(true)}/></div>
 }

    <form className={`w-[190px] lg:w-[350px] h-[40px] lg:flex items-center gap-[10px] bg-[#f0efe7] px-[10px] py-[5px] rounded-md ${!active ? "hidden" : "flex"}`}>
            <div><IoSearch className='w-[23px] h-[23px] text-gray-600 ' /></div>

            <input type="text" className='w-[80%] h-full bg-transparent outline-none' placeholder='search Users'/>
        </form>

        </div>
  
      <div className='flex justify-around items-center gap-[20px] relative'>

{showPopUp && 
        <div className='w-[300px] min-h-[300px] flex flex-col justify-center p-[20px] gap-[20px] items-center absolute bg-white shadow-lg top-[90px] rounded-lg'>
            <div className='w-[70px] h-[70px] rounded-full overflow-hidden'>
            <img src={userData.profileImage || dp} alt="" className='w-full h-full' />
        </div>
        <div className='text-[18px] font-semibold text-gray-700'>{`${userData.firstName} ${userData.lastName}`}</div>
        <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]'>View Profile</button>
        <div className='w-full h-[1px] bg-gray-700'></div>
          <div className='lg:flex w-full items-center justify-start text-gray-600 gap-[10px] cursor-pointer' onClick={()=>navigate('/network')}>
            <FaUserGroup className='w-[23px] h-[23px] text-gray-600'/>
            <div>My Network</div>
        </div>
                <button 
                onClick={handleSignOut}
                className='w-[100%] h-[40px] rounded-full border-2 border-[#ec4545] text-[#ec5454] cursor-pointer'>sign out</button>

        </div>}



        

        <div className='lg:flex flex-col items-center justify-center text-gray-600 hidden'>
            <IoIosHome className='w-[23px] h-[23px] text-gray-600'/>
            <div>Home</div>
        </div>
        <div className='lg:flex flex-col items-center justify-center text-gray-600 hidden cursor-pointer'
        onClick={()=>navigate('/network')}>
            <FaUserGroup className='w-[23px] h-[23px] text-gray-600'/>
            <div>My Network</div>
        </div>
        <div className='flex flex-col items-center justify-center text-gray-600 '>
            <IoIosNotifications className='w-[23px] h-[23px] text-gray-600'/>
            <div className='md:block'>Notifications</div>
        </div >
        <div onClick={()=> setShowPopUp((prev) => !prev)} className='w-[50px] h-[50px] cursor-pointer rounded-full overflow-hidden'>
            <img src={dp} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Nav