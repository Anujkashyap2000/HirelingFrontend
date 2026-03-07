import React, { useState } from "react";
import "./pro.css"; 
import logo from "../../../assets/logo.png";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import  workerService  from "../../../../Service/worker.js";

const RegistrationPage = () => {
  const [useGeolocation, setUseGeolocation] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profession: "",
    experiance: "",
    age: "",
    address: {
      pincode: "",
      city: "",
      country: "",
      district: "",
      state: "",
      houseAddress: "",
      nearby: "",
    },
    location: {
      type: "Point",
      coordinates: [0, 0], // [longitude, latitude]
    },
    aadharNo: "",
    rate: "",
    phoneNo: "",
    password: "",
    confirmPassword: "",
    profileImage: null, 
    resume: null, 
    aadharPdf: null, 
  });

  const handleRadioChange = async () => {
    const newUseGeolocation = !useGeolocation;

    setUseGeolocation(newUseGeolocation);

    if (newUseGeolocation) {
      try {
        
        const coords = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) =>
              resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
            (err) => reject(err),
          );
        });
        setFormData((prev) => ({
          ...prev,
          location: {
            type: "Point",
            coordinates: [coords.lon, coords.lat], 
          },
        }));

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lon}&accept-language=en`,
          {
            headers: { "User-Agent": "LaborConnectionApp" },
          },
        );

        const data = await response.json();

        if (data && data.address) {
          console.log("Address found:", data.address);

          setFormData((prev) => ({
            ...prev,
            address: {
              ...prev.address,
              pincode: data.address.postcode || "",
              city:
                data.address.city ||
                data.address.town ||
                data.address.village ||
                "",
              country: data.address.country || "",
              district: data.address.state_district || "",
              state: data.address.state || "",
            },
          }));
        }
      } catch (err) {
        console.error("Geolocation or Geocoding failed:", err);
        alert("Could not detect your location automatically.");
      }
    } else {
   
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          pincode: "",
          city: "",
          country: "",
          district: "",
          state: "",
       
        },
      }));
    }
  };

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const [imagePreview, setImagePreview] = useState(null); 
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (name === "profileImage") {
        setFormData((prevData) => ({
          ...prevData,
          profileImage: files[0],
        }));
    
        if (files[0]) {
          setImagePreview(URL.createObjectURL(files[0]));
        } else {
          setImagePreview(null);
        }
      } else if (name === "resume") {
        setFormData((prevData) => ({
          ...prevData,
          resume: files[0],
        }));
      } else if (name === "aadharPdf") {
        setFormData((prevData) => ({
          ...prevData,
          aadharPdf: files[0],
        }));
      }
    } else if (name.includes(".")) {
      const [objectName, keyName] = name.split(".");

      setFormData((prev) => ({
        ...prev,
        [objectName]: {
          ...prev[objectName],
          [keyName]: value,
        },
      }));
    } else {
      
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    if (!formData.profession.trim()) {
      newErrors.profession = "Profession is required";
      isValid = false;
    }
    if (!formData.experiance) {
      newErrors.experiance = "experiance is required";
      isValid = false;
    }

    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
      isValid = false;
    } else if (isNaN(formData.age) || parseInt(formData.age) <= 0) {
      newErrors.age = "Age must be a valid number";
      isValid = false;
    }

    if (!formData.aadharNo.trim()) {
      newErrors.aadharNo = "Aadhar No is required";
      isValid = false;
    } else if (!/^\d{12}$/.test(formData.aadharNo)) {
      newErrors.aadharNo = "Aadhar No must be a 12-digit number";
      isValid = false;
    }

    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = "Phone  No is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phoneNo)) {
      newErrors.phoneNo = "Phone No must be a 10-digit number";
      isValid = false;
    }
    if (!formData.rate.trim()) {
      newErrors.rate = "Hourly wage is required";
      isValid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!formData.profileImage) {
      newErrors.profileImage = "Profile image is required";
      isValid = false;
    }

    if (!formData.resume) {
      newErrors.resume = "Resume is required";
      isValid = false;
    } else if (formData.resume.type !== "application/pdf") {
      newErrors.resume = "Resume must be a PDF file";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response =await  workerService.register(formData)
        console.log(response);
        
        toast.success("Signup successful!");
        setFormData({
          name: "",
          email: "",
          profession: "",
          experiance: "",
          age: "",
          address: {
            pincode: "",
            city: "",
            country: "",
            district: "",
            state: "",
            houseAddress: "",
            nearby: "",
          },
          location: {
            type: "Point",
            coordinates: [0, 0],
          },
          aadharNo: "",
          rate: "",
          phoneNo: "",
          password: "",
          confirmPassword: "",
          profileImage: null,
          resume: null,
          aadharPdf: null,
        });

        navigate("/Signin");
      } catch (error) {
        console.error("Error during signup:", error);
        toast.error(
          "Signup failed: " + (error.response?.data || "Something went wrong"),
        );
      }
    }
  };


  

  return (
    <div className="container">
      <div className="auth-logo">
        <img src={logo} alt="Hireling" />
      </div>
      <div className="registration-container">
        <h2>Skilled Labor Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="profession">Applying For Profession:</label>
           
            <select name="profession" id="profession" onChange={handleChange}>
              <option value="Handyman">Handyman</option>
              <option value="Painter">Painter</option>
              <option value="Plumber">Plumber</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Builder">Builder</option>
              <option value="Electrician">Electrician</option>
              <option value="Gardner">Gardner</option>
              <option value="Home cleaner">Home cleaner</option>
              <option value="Interior designer">Interior designer</option>
              <option value="Car washer">Car washer</option>
            </select>

            {errors.profession && <p className="error">{errors.profession}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="experiance">Experiance in years</label>
            <input
              type="number"
              id="experiance"
              name="experiance"
              value={formData.experiance}
              onChange={handleChange}
            />
            {errors.experiance && <p className="error">{errors.experiance}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              name="age"
              min="18"
              value={formData.age}
              onChange={handleChange}
            />
            {errors.age && <p className="error">{errors.age}</p>}
          </div>


          <div className="form-group">
            <label htmlFor="use-geo"> Use Current Location</label>
            <input
              type="checkbox"
              id="use-geo"
              checked={useGeolocation}
              onChange={handleRadioChange}
            />
          </div>
          <>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="address.city"
                placeholder="Enter City"
                value={formData.address.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="address.country"
                placeholder="Enter Country"
                value={formData.address.country}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">District</label>
              <input
                type="text"
                id="district"
                name="address.district"
                placeholder="Enter District"
                value={formData.address.district}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="address.state"
                placeholder="Enter state"
                value={formData.address.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="pincode">Pincode:</label>
              <input
                type="number"
                id="pincode"
                name="address.pincode"
                placeholder="Enter Pincode"
                minLength={6}
                maxLength={6}
                value={formData.address.pincode}
                onChange={handleChange}
                required
              />
            </div>
          </>

          <div className="form-group">
            <label htmlFor="houseAddress">House Address:</label>
            <textarea
              id="houseAddress"
              name="address.houseAddress"
              placeholder="Enter Address"
              value={formData.houseAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="nearby">Near By Landmark(Optional):</label>
            <textarea
              id="nearby"
              name="address.nearby"
              placeholder=" Optional"
              value={formData.nearby}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="aadharNo">Aadhar No:</label>
            <input
              type="number"
              id="aadharNo"
              name="aadharNo"
              value={formData.aadharNo}
              onChange={handleChange}
            />
            {errors.aadharNo && <p className="error">{errors.aadharNo}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="phoneNo">Phone No:</label>
            <input
              type="number"
              id="phoneNo"
              name="phoneNo"
              min="6000000000"
              max="9999999999"
              value={formData.phoneNo}
              onChange={handleChange}
            />
            {errors.phoneNo && <p className="error">{errors.phoneNo}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="rate">Hourly Rate:</label>
            <input
              type="number"
              id="rate"
              name="rate"
              min="1"
              value={formData.pricePerHour}
              onChange={handleChange}
            />
            {errors.pricePerHour && (
              <p className="pricePerHour">{errors.pricePerHour}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Re-enter Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}
          </div>

        
          <div className="form-group">
            <label htmlFor="profileImage">Profile Image</label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
              aria-invalid={errors.profileImage ? "true" : "false"}
              aria-describedby="profileImage-error"
            />
            {errors.profileImage && (
              <p className="error" id="profileImage-error">
                {errors.profileImage}
              </p>
            )}
            {imagePreview && (
              <div>
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  style={{ maxWidth: "100px", maxHeight: "100px" }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="resume">Upload Resume (PDF):</label>
            <input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf"
              onChange={handleChange}
            />
            {errors.resume && <p className="error">{errors.resume}</p>}
          </div>


          <div className="form-group">
            <label htmlFor="aadharPdf">Upload Aadhar (PDF):</label>
            <input
              type="file"
              id="aadharPdf"
              name="aadharPdf"
              accept=".pdf"
              onChange={handleChange}
            />
            {errors.aadhar && <p className="error">{errors.aadhar}</p>}
          </div>

          <button type="submit" className="submit-button">
            Register
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?
            <Link to="/Signin">Sign in</Link>
          </p>
        </div>
      </div>

      <br />
      <br />
    </div>
  );
};

export default RegistrationPage;
