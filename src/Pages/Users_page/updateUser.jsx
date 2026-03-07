import React, { useState } from "react";
import "../Form_page/Auth/signin.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CustomerService from "../../../Service/customer";
import { useSelector } from "react-redux";

const UpdateUser = () => {
  const userData =  useSelector((state) => state?.auth?.userData);
  const navigate = useNavigate();

  const [useGeolocation, setUseGeolocation] = useState(false);
  
  const [userDetails, setUserDetails] = useState({
    address: {
      pincode: userData?.address[0]?.pincode || "",
      city: userData?.address[0]?.city || "",
      country: userData?.address[0]?.country || "",
      district: userData?.address[0]?.district || "",
      state: userData?.address[0]?.state || "",
      houseAddress: userData?.address[0]?.houseAddress || "",
      nearby: userData?.address[0]?.nearby || "",
      location: {
        type: "Point",
        coordinates: userData?.address[0]?.location?.coordinates || [0, 0], 
      },
    },
    phoneNumber: userData?.phoneNumber || "",
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
        setUseGeolocation(false); // Reset checkbox on failure
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
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    if (name.startsWith("address.")) {
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

  const updateUser = async (e) => {
    e.preventDefault();

    // 1. Password validation
    if (userDetails.password !== userDetails.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // 2. Agreement validation
    if (!userDetails.agreement) {
      toast.error("You must agree to continue.");
      return;
    }

    try {
      await CustomerService.updateUser(userData._id, userDetails);
      toast.success("Profile updated successfully");
      navigate("/userprofile", { replace: true });
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Update Profile</h1>
        <form onSubmit={updateUser}>
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
            <label htmlFor="phoneNumber">PhoneNumber:</label>
            <input
              type="text" 
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter Phone number"
              minLength={10}
              maxLength={10}
              value={userDetails.phoneNumber}
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

export default UpdateUser;