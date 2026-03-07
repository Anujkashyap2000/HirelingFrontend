import React, { useState } from "react";
import "./signin.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import customerService from "../../../../Service/customer.js"
const signup = () => {
  const [useGeolocation, setUseGeolocation] = useState(false);
  const [signupuser, setSignupuser] = useState({
    name: "",
    email: "",
    addresses: [{
      pincode: "",
      city: "",
      country: "",
      district: "",
      state: "",
      houseAddress: "",
      nearby: "",
      location: {
        type: "Point",
        coordinates: [0, 0], // [longitude, latitude]
      },
    }],

    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreement: false,
  });

  const navigate = useNavigate();

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
        

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lon}&accept-language=en`,
          {
            headers: { "User-Agent": "LaborConnectionApp" },
          },
        );

        const data = await response.json();

        if (data && data.address) {
          console.log("Address found:", data.address);

          setSignupuser((prev) => {
          const newAddresses=[...prev.addresses]

            newAddresses[0]={
              ...newAddresses[0],
              pincode: data.address.postcode || "",
              city:
                data.address.city ||
                data.address.town ||
                data.address.village ||
                "",
              country: data.address.country || "",
              district: data.address.state_district || "",
              state: data.address.state || "",
              location: {
            type: "Point",
            coordinates: [coords.lon, coords.lat],
          },
            }
              return { ...prev, addresses: newAddresses };
            
          });
        }
      } catch (err) {
        console.error("Geolocation or Geocoding failed:", err);
        alert("Could not detect your location automatically.");
      }
    } else {
      setSignupuser((prev) => ({
        ...prev,
        addresses: [{
          ...prev.addresses,
          pincode: "",
          city: "",
          country: "",
          district: "",
          state: "",
        },]
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    if (name.startsWith("address.")) {
    const keyName = name.split(".")[1];
    setSignupuser((prev) => {
      const newAddresses = [...prev.addresses];
      newAddresses[0] = { ...newAddresses[0], [keyName]: val };
      return { ...prev, addresses: newAddresses };
    });
  } else {
      setSignupuser((prev) => ({
        ...prev,
        [name]: val,
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (signupuser.agreement) {
      await customerService.register(signupuser)
        .then(() => {
          toast.success("Signup successful");
          setSignupuser({
            name: "",
            email: "",
            addresses: [{
              pincode: "",
              city: "",
              country: "",
              district: "",
              state: "",
              houseAddress: "",
              nearby: "",
              location: {
              lat: "",
              lon: "",
            },
            }],
            
            phoneNumber: "",
            password: "",
            confirmPassword: "",
            agreement: false,
          });
          navigate("/signin");
        })
        .catch((err) => {
          console.error("Error:", err.response);
          toast.error("Something went wrong during signup");
        });
    } else {
      toast.error("Please accept the agreement");
    }
  };

  return (
    <div>
      <div className="auth-container">
        <div className="auth-logo">
          <img src={logo} alt="Hireling" />
        </div>
        <div className="auth-form">
          <h1>Create Account</h1>

          <form id="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter Name"
                value={signupuser.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter Email"
                value={signupuser.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="use-geo" style={{display:"inline"}}> Use Current Location</label>
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
                  value={signupuser.addresses[0].city}
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
                  value={signupuser.addresses[0].country}
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
                  value={signupuser.addresses[0].district}
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
                  value={signupuser.addresses[0].state}
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
                  value={signupuser.addresses[0].pincode}
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
                value={signupuser.addresses[0].houseAddress}
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
                value={signupuser.addresses[0].nearby}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">PhoneNumber:</label>
              <input
                type="number"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter Phone number"
                minLength={10}
                maxLength={10}
                value={signupuser.phoneNumber}
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
                placeholder="Enter Pasword"
                minLength="6"
                required
                value={signupuser.password}
                onChange={handleChange}
              />
              <p className="hint">Passwords must be at least 6 characters.</p>
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Re-enter Password</label>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                placeholder="Enter Confirm Password"
                value={signupuser.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="checkboxGroup">
              <input
                type="checkbox"
                name="agreement"
                onChange={handleChange}
                checked={signupuser.agreement}
              />
              <span>Agree & Continue</span>
            </div>

            <button type="submit" className="auth-button">
              Sign Up 
            </button>
          </form>
          <div className="auth-footer">
            <p>
              Already have an account?
              <Link to="/Signin">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default signup;
