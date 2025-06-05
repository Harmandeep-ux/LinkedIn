import React, { createContext, useEffect, useState } from 'react'
import { useContext } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

export const userDataContext = createContext()

function UserContext({ children }) {
    const [userData, setUserData] = useState(null) 
    const [edit, setedit] = useState(false)
    let { serverUrl } = useContext(authDataContext)
    const [postData, setPostData] = useState([])

    const getCurrentUser = async () => {
        try {
            let result = await axios.get(serverUrl + '/api/user/currentUser', 
                { withCredentials: true })
            setUserData(result.data)
            console.log(result.data)
        } catch (err) {
            console.log(err)
            setUserData(null)
        } 
    }

    const getPost = async()=>{
        try{
            let result =await axios.get(serverUrl+'/api/post/getpost',{withCredentials:true})
            console.log(result)
            setPostData(result.data)
        }catch(err){
           console.log(err)
        }
    }
    useEffect(() => {
        getCurrentUser()
        getPost()
    }, [])

  
    const value = {
        userData,
        setUserData,   
          edit,
          setedit,postData,setPostData,getPost
    }

    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    )
}

export default UserContext