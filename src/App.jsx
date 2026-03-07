import React ,{useEffect,useState} from "react";
import { RouterProvider, useNavigate, useLocation } from "react-router-dom"
import authService from '../Service/auth'
import { Provider, useDispatch, useSelector } from "react-redux";
import Layout from "./layout"
import {login} from "./Store/authSlice"

//import socket from './socket.js'; // Import the instance you created

const App=()=>{
const location = useLocation();
  const userData = useSelector(state => state.auth.userData)
  const navigate = useNavigate()
  const dispatch = useDispatch()


useEffect(()=>{
 
    if(!userData){
    authService.getCurrentUser().then((response) => {

          if (response == null) {
            if (location.pathname !== '/signup') {
              navigate('/');
            }
            return; // CRITICAL: Exit early so the code below doesn't crash
          }


          const userPayload = response?.data?.data;
          dispatch(login(userPayload));
          
      
          const role = userPayload?.user?.role;
   
    if((location.pathname === '/' ) && role === "CUSTOMER" ){
      navigate('/userProfile')
    }
    else if(location.pathname === '/' && role === "WORKER" ){
      navigate('/workerProfile')
    }else if(location.pathname === '/' && role === "ADMIN"){
      navigate('/admin')
    }
    }).catch((error)=>{console.log(error)})
  }
  },[])


  // const [status, setStatus] = useState("Connecting...");

  // useEffect(() => {
  //   // Listener for successful connection
  //   socket.on("connect", () => {
  //     setStatus("Connected! ✅");
  //     console.log("My Socket ID is:", socket.id);
  //   });

  //   // Listener for when the server sends a message
  //   socket.on("welcome-event", (data) => {
  //     console.log("Server says:", data);
  //   });

  //   // Cleanup: Remove listeners when the component closes
  //   return () => {
  //     socket.off("connect");
  //     socket.off("welcome-event");
  //   };
  // }, []);

  // const sendPing = () => {
  //   socket.emit("ping-server", { message: "Hello from Frontend!" });
  // };

  return (
    
      <Layout/>
    //   <div>
    //   <h1>Frontend App</h1>
    //   <p>Status: {status}</p>
    //   <button onClick={sendPing}>Send Message to Backend</button>
    // </div>
    
  );
};

export default App;