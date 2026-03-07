

import React, { useState } from "react";
import "../Form_page/Auth/signin.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import WorkerService from "../../../Service/worker";
import { useSelector } from "react-redux";

const UpdateWorker = () => {
  const userData =  useSelector((state) => state?.auth?.userData);
  const navigate = useNavigate();
  const [useGeolocation, setUseGeolocation] = useState(false);
     const [imagePreview, setImagePreview] = useState(null); 
  const [userDetails, setUserDetails] = useState({
    address: {
      pincode: userData?.address?.pincode || "",
      city: userData?.address?.city || "",
      country: userData?.address?.country || "",
      district: userData?.address?.district || "",
      state: userData?.address?.state || "",
      houseAddress: userData?.address?.houseAddress || "",
      nearby: userData?.address?.nearby || "",
      location: {
        type: "Point",
        coordinates: userData?.address?.location?.coordinates || [0, 0], 
      },
    },
    rate:userData?.rate || "",
    description:userData?.description || "",
    phoneNo: userData?.phoneNo || "",
    password: userData?.password || "",
    confirmPassword: userData?.password || "",
    agreement: false,
  });

  const handleRadioChange = async () => {
    const newUseGeolocation = !useGeolocation;
    setUseGeolocation(newUseGeolocation);

    if (newUseGeolocation) {
      try {
        const coords = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
            (err) => reject(err)
          );
        });

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lon}&accept-language=en`,
          {
            headers: { "User-Agent": "LaborConnectionApp" },
          }
        );

        const data = await response.json();

        if (data && data.address) {
          setUserDetails((prev) => ({
            ...prev,
            address: {
              ...prev.address,
              pincode: data.address.postcode || "",
              city: data.address.city || data.address.town || data.address.village || "",
              country: data.address.country || "",
              district: data.address.state_district || "",
              state: data.address.state || "",
              location: {
                type: "Point",
                coordinates: [coords.lon, coords.lat],
              },
            },
          }));
        }
      } catch (err) {
        console.error("Geolocation failed:", err);
        alert("Could not detect your location automatically.");
        setUseGeolocation(false); 
      }
    } else {
      setUserDetails((prev) => ({
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

  const handleChange = (e) => {
    const { name, value, type, checked,files } = e.target;
    const val = type === "checkbox" ? checked : value;
    if (type === 'file') {
        if (name === 'profileImage') {
            setUserDetails(prevData => ({
                ...prevData,
                profileImage: files[0],
            }));
            if (files[0]) {
                setImagePreview(URL.createObjectURL(files[0]));
            } else {
                setImagePreview(null);
            }
        } else if (name === 'resume') {
            setUserDetails(prevData => ({
                ...prevData,
                resume: files[0],
            }));
        }
    }else if (name.startsWith("address.")) {
      const keyName = name.split(".")[1];
      setUserDetails((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [keyName]: val,
        },
      }));
    } else {
      setUserDetails((prev) => ({
        ...prev,
        [name]: val,
      }));
    }
  };

  const updateWorker = async (e) => {
    e.preventDefault();

    if (userDetails.password || userDetails.confirmPassword) {
      if (userDetails.password !== userDetails.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
    }

    if (!userDetails.agreement) {
      toast.error("You must agree to continue.");
      return;
    }

    const payload = {};

    if (userDetails.rate) payload.rate = userDetails.rate;
    if (userDetails.description) payload.description = userDetails.description;
    if (userDetails.phoneNo) payload.phoneNo = userDetails.phoneNo;
    if (userDetails.password) payload.password = userDetails.password;

    if (userDetails.profileImage) payload.profileImage = userDetails.profileImage;
    if (userDetails.resume) payload.resume = userDetails.resume;

    const addressPayload = {};
    const { address } = userDetails;

    if (address.pincode) addressPayload.pincode = address.pincode;
    if (address.city) addressPayload.city = address.city;
    if (address.country) addressPayload.country = address.country;
    if (address.district) addressPayload.district = address.district;
    if (address.state) addressPayload.state = address.state;
    if (address.houseAddress) addressPayload.houseAddress = address.houseAddress;
    if (address.nearby) addressPayload.nearby = address.nearby;

    if (address.location && (address.location.coordinates[0] !== 0 || address.location.coordinates[1] !== 0)) {
      addressPayload.location = address.location;
    }

    if (Object.keys(addressPayload).length > 0) {
      payload.address = addressPayload;
    }

    try {
      await WorkerService.updateUser(userData._id, payload);
      toast.success("Profile updated successfully");
      navigate("/workerprofile", { replace: true });
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Update Profile</h1>
        <form onSubmit={updateWorker}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData?.name || ""}
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="rate">Wages Rate(in hours)</label>
             <input
              type="number"
              id="rate"
              name="rate"
              min="1"
              placeholder="Enter rate per hour"
              value={userDetails.rate}
              onChange={handleChange}
              
             
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Something 
                about 
                you
            </label>
            <textarea
              type="String"
              id="description"
              name="description"
              placeholder="Write something 
                about 
                you"
              value={userDetails.description}
              onChange={handleChange}
              required
            />
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

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="address.city"
              placeholder="Enter City"
              value={userDetails.address.city}
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
              value={userDetails.address.country}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="district">District</label>
            <input
              type="text"
              id="district"
              name="address.district"
              placeholder="Enter District"
              value={userDetails.address.district}
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
              value={userDetails.address.state}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pincode">Pincode:</label>
            <input
              type="text" 
              id="pincode"
              name="address.pincode"
              placeholder="Enter Pincode"
              minLength={6}
              maxLength={6}
              value={userDetails.address.pincode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="houseAddress">House Address:</label>
            <textarea
              id="houseAddress"
              name="address.houseAddress"
              placeholder="Enter Address"
              value={userDetails.address.houseAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nearby">Near By Landmark (Optional):</label>
            <textarea
              id="nearby"
              name="address.nearby"
              placeholder="Optional"
              value={userDetails.address.nearby}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNo">PhoneNumber:</label>
            <input
              type="text" 
              id="phoneNo"
              name="phoneNo"
              placeholder="Enter Phone number"
              minLength={10}
              maxLength={10}
              value={userDetails.phoneNo}
              onChange={handleChange}
              required
            />
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

            </div>


           <div className="form-group">
                    <label htmlFor="profileImage">Profile Image</label>
                            <input
                                type="file"
                                id="profileImage"
                                name="profileImage"
                                accept="image/*" 
                                onChange={handleChange}
                          
                            />
                           
                            {imagePreview && (
                                <div>
                                    <img src={imagePreview} alt="Profile Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                </div>
                            )}
                            </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter Password"
              minLength="6"
              value={userDetails.password}
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
              value={userDetails.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="checkboxGroup">
            <input
              type="checkbox"
              name="agreement"
              onChange={handleChange}
              checked={userDetails.agreement}
            />
            <span>Agree & Continue</span>
          </div>

          <button type="submit" className="auth-button">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateWorker;