import React from 'react'
import { createContext } from 'react'

export const authDataContext = createContext()

function AuthContext({children}) { //children is App.jsx

    let serverUrl = "http://localhost:8000"

    let value = {
       serverUrl
    }
  return (
    <authDataContext.Provider value={value}>
        <div>{children}</div>
    </authDataContext.Provider>
  )
}

export default AuthContext