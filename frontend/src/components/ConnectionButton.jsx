import React from 'react'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import io from 'socket.io-client'
import { useEffect } from 'react'
import { userDataContext } from '../context/UserContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const socket=io("http://localhost:8000")

const connectionButton = ({userId}) => {
let {serverUrl} = useContext(authDataContext)
let {userData,setuserData } = useContext(userDataContext)
const [status, setstatus] = useState("")
let navigate = useNavigate()

 const handleSendConnection = async () => {
  try {
    const response = await axios.post(
      `${serverUrl}/api/connection/send/${userId}`,
      {},
      { 
        withCredentials: true,
        headers: {
          'Accept': 'application/json', // Explicitly request JSON
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Handle success
  } catch (error) {
    let errorMessage = 'Connection request failed';
    
    // Check if response is HTML
    if (error.response && 
        error.response.headers['content-type']?.includes('text/html')) {
      // Extract potential error from HTML
      const html = error.response.data;
      const match = html.match(/<pre>(.*?)<\/pre>/s);
      errorMessage = match ? match[1] : 'Server error (check console)';
      
      console.error('Server returned HTML error:', html);
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    alert(errorMessage);
  }
};
    const handleRemoveConnection= async()=>{
        try{
            let result = await axios.delete(`${serverUrl}/api/connection/remove/${userId}`,{},{withCredentials:true})
            console.log(result)
        }catch(err){
            console.log(err)
        }
    }

    
  const handleGetStatus = async () => {
    try {
        const result = await axios.get(
            `${serverUrl}/api/connection/getstatus/${userId}`,
            { withCredentials: true }
        );
        
        // Add null check for response data
        if (result.data && result.data.status) {
            setstatus(result.data.status);
        } else {
            console.error('Invalid response format:', result.data);
            setstatus("error");
        }
    } catch (err) {
        console.error("Error getting connection status:", 
            err.response?.data?.msg || err.message
        );
        setstatus("error");
    }
};
   useEffect(()=>{
    socket.emit("register",userData._id)
    handleGetStatus()

    socket.on('statusUpdate',({updateUserId,newStatus})=>{
        if(updateUserId==userId){
            setstatus(newStatus)
        }
    })
    return ()=>{
        socket.off("statusUpdate")
    }
   },[userId])


  const handleClick =async()=>{
     if(status=="disconnect"){
        await handleRemoveConnection()
     }else if(status =="received"){
          navigate('/network')
     }else{
await handleSendConnection()
     }
  }

  return (
        <button className='min-w-[100px] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]'onClick={handleClick}>{status}</button>
  )
}

export default connectionButton