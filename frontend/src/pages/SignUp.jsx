import React, { useContext } from 'react'
import logo from '../assets/logo.svg'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { userDataContext } from '../context/UserContext'

const SignUp = () => {
  
    const [show, setshow] = useState(false)
    let {serverUrl} = useContext(authDataContext)
    let {userData, setUserData} =useContext(userDataContext)
    let navigate =  useNavigate()

    const [firstName, setfirstName] = useState('')
    const [lastName, setlastName] = useState('')
    const [userName, setuserName] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [loading, setloading] = useState(false)
    const [err, seterr] = useState('')

    const handleSignUp = async (e) =>{
        e.preventDefault()
        setloading(true)
        seterr('') // Clear previous errors
        try{
           let result = await axios.post(serverUrl+"/api/auth/signup",{
           firstName,
           lastName,
           email,
           userName,
           password
           },{withCredentials:true})
           setloading(false)
           console.log(result)
           setUserData(result.data)
           // Optionally navigate to login after successful signup
           navigate('/')
        }catch(err){
            setloading(false)
            seterr(err.response?.data?.message || 'Signup failed. Please try again.')
          console.log(err)
        }
    }
  return (
    <div className='w-full h-screen bg-[white] flex flex-col items-center justify-start'>
    <div className='p-[30px] lg:p-[35px] w-full flex items-center'>
        <img src={logo} alt="" />
    </div>
 
   <form onSubmit={handleSignUp} className="w-[90%] max-w-[400px] h-[600px] md:shadow-xl flex flex-col  justify-center gap-[10px] p-2">
    <h1 className='text-gray-800 text-[30px]  font-semibold items-center'>Sign up</h1>
    <input type="text" className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] rounded-md px-[20px] py-[10px]'
    placeholder='firstName' required  onChange={(e) => setfirstName(e.target.value)}/>

    <input type="text" className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] rounded-md px-[20px] py-[10px]'
     placeholder='lastName' required onChange={(e) => setlastName(e.target.value)} />

    <input type="text" className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] rounded-md px-[20px] py-[10px]'
     placeholder='userName' required onChange={(e) => setuserName(e.target.value)}/>
    <input type="text" className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] rounded-md px-[20px] py-[10px]'
     placeholder='email' required onChange={(e)=> setemail(e.target.value)} />

    <div className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] rounded-md relative'>
    <input type={show ? "text" : "password"} className='w-full h-full border-none text-gray-800 text-[18px] rounded-md px-[20px] py-[10px]'
     placeholder='password' required onChange={(e) => setpassword(e.target.value)} />
  
    <span onClick={() =>setshow(prev => !prev)} className='absolute right-[20px] top-[10px] text-[#24b2ff] cursor-pointer'>{show ? "hidden" : "show"}</span>
    </div>
   
    {/* Error message with better styling */}
    {err && (
      <p className="text-red-500 text-sm mt-2 mb-2 text-center">{err}</p>
    )}
    
    <button className='text-white bg-[#24b2ff] mt-[40px] h-[50px] w-[full]  flex items-center justify-center rounded-full' disabled={loading}>
      {loading ? "Loading..." : "Sign Up"}
    </button>

    <p onClick={() =>navigate('/login')} className='text-center cursor-pointer'>Already have an Account ? <span  className='text-[#24b2ff]'>Sign In</span></p>
   </form>

    </div>
  )
}

export default SignUp