import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../../Store/authSlice";
import axios from "axios";
import authService from "../../../Service/auth.js"

function Navbar() {

  const navigate = useNavigate();
  const userData = useSelector((state) => state?.auth?.userData);
  const dispatch = useDispatch();


 const logout = async () => {
  try {
  
    const res=await authService.logout()

  
    dispatch(logoutAction()); 

   
    toast.success("Logged out successfully");
    navigate("/");

  } catch (err) {
    console.error("Server logout failed:", err);
 
    dispatch(logoutAction());
    localStorage.clear();
    navigate("/");
  }
};

  // Determine profile route based on login type
  // let profileRoute = "";
  // if (userData.role==ADMIN) {
  //   profileRoute = "/admindashboard";
  // } else if (userData.role==WORKER) {
  //   profileRoute = "/workerprofile";
  // } else if (userData.role==CUSTOMER) {
  //   profileRoute = "/userprofile";
  // }

  return (
    <div id="header">
      <nav className="navbar">
        
        <figure className="navbar-logo">
          <img src={logo} alt="Logo" id="logo" />
        </figure>

        <div className="nav-right">
          {userData ? (
            <Fragment>
              {/* <div>
                <Link to={profileRoute}>Profile</Link>
              </div> */}
              &nbsp;&nbsp;
              <br />
              <button className="signup-button" onClick={logout}>
                Logout
              </button>
            </Fragment>
          ) : (
            <Fragment>
              <div className="join">
                <Link to="/Pro">Join as a Pro</Link>
              </div>

              <div className="navbar-auth">
                <Link to="/Signup">
                  <button className="signup-button">Sign Up</button>
                </Link>
                <Link to="/Signin">
                  <button className="signup-button">Login</button>
                </Link>
              </div>
            </Fragment>
          )}
        </div>
        
        
      </nav>
          <div className="list">
        <ul className="navbar-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          
          <li>
            <Link to="/how-it-works">How it Works</Link>
          </li>
        </ul>
      </div>
      
    </div>
  );
}

export default Navbar;
