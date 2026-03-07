import React, { useState } from "react";
import logo from "../../../assets/logo.png";
import axios from "axios";
import authService from "../../../../Service/auth.js";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./signin.css";
import { useDispatch } from "react-redux";
import { login } from "../../../Store/authSlice";

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await authService.login(formData);


      if (userData.status === 401) {
        toast.error("Check your credentials 🙁");
        return;
      } else if (userData.status === 404) {
        toast.error("User doesn't Exist 🙁");
        return;
      }

      dispatch(login(userData?.data?.data));
      const user = userData?.data?.data.user;

      if (user && user.role === "WORKER") {
        toast.success("Login successful! Redirecting...");
        navigate("/workerProfile");
      } else if (user && user.role === "CUSTOMER") {
        toast.success("Login successful! Redirecting...");
        navigate("/userprofile");
      } else if (user && user.role === "ADMIN") {
        toast.success("Login successful! Redirecting...");
        navigate("/admindashboard");
      } else {
        console.error("Login failed with message:", userData?.message);
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred during login";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">
        <Link to="/">
          <img src={logo} alt="Hireling logo" />
        </Link>
      </div>
      <div className="auth-form-wrapper">
        <div className="auth-form">
          <h1>Sign in</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                placeholder="Enter email"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="auth-button">
              Sign in
            </button>
          </form>
          <div className="auth-footer">
            <p>
              New to Hireling? <Link to="/Signup">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;