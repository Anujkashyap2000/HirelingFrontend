import React, { useState,useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import authService from '../../Service/auth'
import {login} from "../Store/authSlice"
import { SpinnerDotted } from 'spinners-react';

const UserPrivate = ({ children }) => {

  const [loading, setLoading]=useState("false")
  let userData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(()=>{
 
    if(!userData){
    setLoading("loading")
    authService.getCurrentUser().then((userData)=>{
      if(userData == null && !location.pathname === '/signup') navigate('/')
      dispatch(login(userData?.data?.data))
       const role=userData?.data?.data.user.role
   
    if((location.pathname === '/' ) && role === "CUSTOMER" ){
      navigate('/userProfile')
    }
    else if(location.pathname === '/' && role === "WORKER" ){
      navigate('/workerProfile')
    }else if(location.pathname === '/' && role === "ADMIN"){
      navigate('/admin')
    }

    setLoading("false")
    
    }).catch((error)=>{console.log(error)})
 
  

  }
  },[userData, navigate])
  
    if(loading=="loading"){
      return(<div style={{
        height: "100vh",           // 100% of viewport height
        width: "100vw",            // 100% of viewport width
        display: "flex", 
        justifyContent: "center",  // Centers horizontally
        alignItems: "center",      // Centers vertically
        backgroundColor: "#242424", // Dark background (matches your navbar)
        position: "fixed",         // Ensures it sits on top of everything
        top: 0,
        left: 0,
        zIndex: 9999               // Keeps it above other elements
      }}>
       <SpinnerDotted color="#f78c13" size={70}/>
      </div>
       
      )
    }else if(loading=="false"){
      return children;
    }
  }


export default UserPrivate;
