
import React,{useState,useEffect} from "react";
import { useNavigate, } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "../Users_page/userProfile.module.css";
import LandingPage from "../Landing_page/LandingPage";


import { MapPin, Mail, Settings, CalendarCheck,RefreshCw } from "lucide-react";

const UserProfile = () => {
  const userData = useSelector((state) => state?.auth?.userData);
  const [current, setCurrent]=useState({
                pincode:  "",
                city:"",
                country: "",
                district:  "",
                state:  "",
    });

  const navigate = useNavigate();

  const handleUpdate = () => {
    navigate("/updateUser");
  };

  const handleAppointment = () => {
    navigate("/updateAppointment");
  };


  const handleRadioChange = async () => {
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
            
            setCurrent({
              pincode: data.address.postcode || "",
                city:
                  data.address.city ||
                  data.address.town ||
                  data.address.village ||
                  "",
                country: data.address.country || "",
                district: data.address.state_district || "",
                state: data.address.state || "",
            })
        
          }
        } catch (err) {
          console.error("Geolocation or Geocoding failed:", err);
          alert("Could not detect your location automatically.");
        }
      } 

      useEffect(() => {
    handleRadioChange();
  }, []);

  const addressObj = userData?.address?.[0];
  const locationString = current 
    ? `${current.city}, ${current.state}` 
    : "No location added";

  const initial = userData?.name ? userData.name.charAt(0).toUpperCase() : "U";

  return (
    <div className={styles.container}>
      
      <header className={styles.profileBanner}>
        
        <div className={styles.profileLeft}>
          <div className={styles.avatar}>
            {initial}
          </div>
          
          <div className={styles.userDetails}>
            <h1 className={styles.welcomeText}>Welcome back, {userData?.name || "User"} </h1>
            <div className={styles.metaInfo}>
              <span className={styles.metaItem}>
                <Mail size={16} /> 
                {userData?.email || "No email provided"}
              </span>
              <span className={styles.metaItem}>
                <MapPin size={16} /> 
                {locationString}
                <RefreshCw onClick={handleRadioChange} />
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actionGroup}>
          <button onClick={handleUpdate} className={styles.btnOutline}>
            <Settings size={18} /> Update Profile
          </button>
          <button onClick={handleAppointment} className={styles.btnPrimary}>
            <CalendarCheck size={18} /> My Bookings
          </button>
        </div>

      </header>

      <LandingPage place={current} />

    </div>
  );
};

export default UserProfile;