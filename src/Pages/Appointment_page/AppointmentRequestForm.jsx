import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../Form_page/Auth/signin.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import authService from "../../../Service/auth";
import { login } from "../../Store/authSlice";
import "./AppointmentRequest.css";
import ProjectService  from "../../../Service/project";
const AppointmentRequest = () => {
  const [useGeolocation, setUseGeolocation] = useState(false);
  const [newAddress, setNewAddress] = useState({});
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
  const { state } = useLocation();
  const { workerId } = useParams();
  const workerData = state?.worker;



  const navigate = useNavigate();

  let [formData, setFormData] = useState({
    userId: "",
    workerId: workerId,
    userName: "",
    userAddress: [],
    address: {
      pincode: "",
      city: "",
      country: "",
      district: "",
      state: "",
      houseAddress: "",
      nearby: "",
      location: {
        type: "Point",
        coordinates: [0, 0], 
      },
    },

    workerName: "",
    profession: "",
    rate: "",
    description: "",
    workImage: null,
    requiredTime: "",
    preferredDateAndTime: "",
    amount: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
const user1=useSelector((state)=>state.auth.userData)
console.log("Redux",user1);


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
              location: {
                type: "Point",
                coordinates: [coords.lon, coords.lat], 
              },
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

  useEffect(() => {
    console.log(user1);
    
    if (user1) {
          setFormData((prev) => ({
            ...prev,
            userName: user1.name,
            userAddress: user1.address,
            userId: user1._id,
          }));
        }

    if (!workerData && workerId) {
      axios
        .get(`http://localhost:8080/workers/${workerId}`)
        .then((response) => {
          const data = response.data;
          setFormData((prev) => ({
            ...prev,
            workerName: data.name,
            rate: data.rate,
            profession: data.profession,
            workerId: data._id,
          }));
        })
        .catch((error) => {
          toast.error("Failed to load worker data");
        });
    } else if (workerData) {

      setFormData((prev) => ({
        ...prev,
        workerName: workerData.name,
        workerId: workerData._id,
        rate: workerData.rate,

        profession: workerData.profession,
      }));
    }
  }, [workerData, workerId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (name === "workImage") {
        setFormData((prevData) => ({
          ...prevData,
          workImage: files[0],
        }));
        if (files[0]) {
          setImagePreview(URL.createObjectURL(files[0]));
        } else {
          setImagePreview(null);
        }
      }
    } else if (name.startsWith("address.")) {
      const keyName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address, 
          [keyName]: value,
        },
      }));
    } else {
      setFormData((prevData) => {
        const updatedFormData = { ...prevData, [name]: value };

        if (name === "rate" || name === "requiredTime") {
          const rateValue = updatedFormData.rate
            ? parseFloat(updatedFormData.rate)
            : 0;
          const requiredTimeValue = updatedFormData.requiredTime
            ? parseFloat(updatedFormData.requiredTime)
            : 0;
          updatedFormData.amount = rateValue * requiredTimeValue;
        }
        return updatedFormData;
      });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
 
    
      let finalFormData = { ...formData };

  let coords = formData.address?.location?.coordinates||[0,0];

  if (coords.every((el) => el === 0)) {
    console.log("Coordinates are [0,0]. Fetching from address string...");
    
const { city, pincode, state } = finalFormData.address;

console.log("FInal");

    setLoading(true);
    

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&city=${city}&state=${state}&postalcode=${pincode}&country=India&limit=1&accept-language=en`,
        { headers: { 'User-Agent': 'LaborConnectionApp' } }
      );
      const data = await res.json();
      console.log("loc",data);
      

      if (data && data.length > 0) {

        const newCoords = [parseFloat(data[0].lon), parseFloat(data[0].lat)];

        finalFormData.address.location = {
          type: "Point",
          coordinates: newCoords
        };

        setFormData(finalFormData);
    
  
      } else {
        alert("Could not find location for the provided address. Please check your address details.");
        setLoading(false);
        return; 
      }
    
  }
  


    const response = await ProjectService.requestAppointment(formData)
      console.log(response);
      toast.success("Appointment request sent!");
      navigate("/userprofile");
   

      
    } catch (err) {
      toast.error("Error sending request");
      console.log(err);
      
    }
  };
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const handleAddressSelect = (addr) => {
    console.log(addr);

    setFormData((prev) => ({
      ...prev,
      address: {
        pincode: addr.pincode || "",
        city: addr.city || "",
        country: addr.country || "",
        district: addr.district || "",
        state: addr.state || "",
        houseAddress: addr.houseAddress || "",
        nearby: addr.nearby || "",
        location: addr.location || prev.location, 
      },
    }));
    toast.success(`Selected ${addr.city} address`);
  };
   console.log("FormData", formData);
  return (
    <div>
      <div className="auth-container">
        <div className="auth-form">
          <h2>Request for Appointment</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="userName">Job Provider Name</label>
              <input
                type="String"
                id="userName"
                name="userName"
                value={formData.userName}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="userAddress">Project venue </label>
              <input
                type="String"
                id="userAddress"
                name="userAddress"
                value={
                  formData.address?.houseAddress +
                  ", " +
                  formData.address?.city +
                  ", " +
                  formData.address?.state +
                  ", " +
                  formData.address?.country
                }
                readOnly
                required
              />
            </div>

            <div className="address-list">
              {formData.userAddress.length > 0 ? (
                formData.userAddress?.map((addr, index) => (
                  <div
                    key={index}
                    className="address-card"
                    onClick={() => handleAddressSelect(addr)}
                  >
                    <h3>
                      Address {index + 1} {addr.isDefault && "⭐"}
                    </h3>
                    <p>
                      <strong>City:</strong> {addr.city}
                    </p>
                    <p>
                      <strong>State:</strong> {addr.state}
                    </p>
                    <p>
                      <strong>Pincode:</strong> {addr.pincode}
                    </p>
                    <p>
                      <strong>Full Address:</strong> {addr.houseAddress}
                    </p>
                    <hr />
                  </div>
                ))
              ) : (
                <p>Loading..</p>
              )}
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
                  value={formData.address?.city}
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
                  value={formData.address?.country}
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
                value={formData.address.houseAddress}
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
              <label htmlFor="workerName">Worker Name </label>
              <input
                type="String"
                id="workerName"
                name="workerName"
                value={formData.workerName}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="profession">Worker Profession </label>
              <input
                type="String"
                id="profession"
                name="profession"
                value={formData.profession}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="rate">Rate per hour</label>
              <input
                type="number"
                id="rate"
                name="rate"
                value={formData.rate}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="description"> Work Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            {/* Image Upload */}
            <div className="form-group">
              <label htmlFor="workImage">Work Image</label>
              <input
                type="file"
                id="workImage"
                name="workImage"
                accept="image/*" // Accept only images
                onChange={handleChange}
               
              />
             
              {imagePreview && (
                <div>
                  <img
                    src={imagePreview}
                    alt="workImage Preview"
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="requiredTime">Required Time(in hours):</label>
              <input
                type="number"
                id="requiredTime"
                name="requiredTime"
                value={formData.requiredTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="preferpreferredDateAndTimeredDate">
                Preferred Date And Time:
              </label>
              <input
                type="datetime-local"
                min={getCurrentDateTime()}
                id="preferredDateAndTime"
                name="preferredDateAndTime"
                value={formData.preferredDateAndTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Payment Amount:</label>
              <input
                id="amount"
                type="number"
                name="amount"
                value={formData.rate * formData.requiredTime}
                onChange={handleChange}
                readOnly
              />
            </div>

            <button type="submit" className="auth-button">
              Send Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentRequest;
