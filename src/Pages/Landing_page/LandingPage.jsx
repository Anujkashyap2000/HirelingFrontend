import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./LandingPage.css";
import  workerService  from "../../../Service/worker";
// Icons
import { MapPin, Briefcase, Search, Star } from "lucide-react";
import ImagesearchRollerIcon from '@mui/icons-material/ImagesearchRoller';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import CarpenterIcon from '@mui/icons-material/Carpenter';
import HandymanIcon from '@mui/icons-material/Handyman';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import YardIcon from '@mui/icons-material/Yard';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import { useSelector } from "react-redux";
const LandingPage = (place) => {
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // State from previous category clicks (if routed here from another page)
  const initialUsers = location.state?.users || [];
  
  const [formData, setFormData] = useState({ pincode: "", profession: "" });
  
  const [workers, setWorkers] = useState(initialUsers);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const userData = useSelector((state) => state?.auth?.userData);

  

   
  


 



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Main Hero Search (By Pincode & Profession) ---
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    setWorkers([]);

    const pincodeArray = formData.pincode.split(",").map((p) => p.trim()).filter(Boolean);

    if (pincodeArray.length === 0) {
      setErrors("Please enter at least one pincode.");
      return;
    } 
    if (!formData.profession) {
      setErrors("Please choose a profession.");
      return;
    }

    setLoading(true);
    try {
      const response=await workerService.getActiveWorker( {
        pincode: pincodeArray,
        profession: formData.profession,
      });
const data = response.data.data || [];

if (data.length === 0) {
  setErrors("No workers found in this area.");
} else {
  setWorkers(data);
  document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
}
    } catch (err) {
      setErrors(err.response?.data?.error || "No workers found in this area.");
    } finally {
      setLoading(false);
    }
  };

  // --- Quick Category Search (By Profession Only) ---
  const handleCategoryClick = async (profession) => {
    setErrors("");
    setWorkers([]);
    setLoading(true);

    try {
            // console.log(current.pincode);

      const response=await workerService.getActiveWorker( {
        pincode:  [place.place.pincode],
        profession: profession,
      });
      console.log(userData);
      
      const data = response.data?.data || [];
      

      setWorkers(data);
      document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      setErrors(err.response?.data?.error || `No ${profession}s available right now.`);
    } finally {
      setLoading(false);
    }
  };






  // --- Navigation to Worker Profile ---
  const handleCardClick = (worker) => {
    console.log(worker);
    
    const isLoggedIn = !!localStorage.getItem("accessToken");
    if (isLoggedIn) {
      navigate(`/worker/${worker._id}`, {
        state: {
          name: worker.name,
          profession: worker.profession,
          image: worker.profileImage || worker.image,
          experiance: worker.experiance,
          rate: worker.rate,
          description: worker.description,
          reviews: worker.reviews
        },
      });
    } else {
      navigate("/signin");
    }
  };

  return (
    <div>
      {/* 1. Hero & Search Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Hire Smarter. <span className="text-gradient">Build Better.</span>
          </h1>
          <p className="hero-subtitle">
            Find top-rated professionals in your area for any home project, repair, or maintenance.
          </p>

          <form onSubmit={handleSearchSubmit} className="search-container">
            <div className="search-input-group">
              <MapPin color="#6b7280" size={20} />
              <input
                type="text"
                name="pincode"
                placeholder="Enter Pincode (e.g. 282001)"
                value={formData.pincode}
                onChange={handleChange}
              />

            </div>
            
            <div className="search-input-group">
              <Briefcase color="#6b7280" size={20} />
              <select name="profession" onChange={handleChange} value={formData.profession}>
                <option value="" disabled>Choose Profession</option>
                <option value="Handyman">Handyman</option>
                <option value="Painter">Painter</option>
                <option value="Plumber">Plumber</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Builder">Builder</option>
                <option value="Electrician">Electrician</option>
                <option value="Gardner">Gardner</option>
                <option value="Home cleaner">Home cleaner</option>
              </select>
            </div>

            <button type="submit" className="btn-search" disabled={loading}>
              {loading ? "Searching..." : "Find Pros"}
            </button>
          </form>
          {errors && (
  <p style={{ 
    color: "#ff4d4d", 
    marginTop: "15px", 
    fontWeight: "600",
    position: "relative", 
    zIndex: "10" 
  }}>
    {errors}
  </p>
)}
        </div>
      </section>

      {/* 2. Quick Categories */}
      <section className="categories-section">
        <h2 style={{ fontSize: '2rem', color: '#111827', marginBottom: '10px' }}>What do you need help with?</h2>
        <div className="categories-scroll">
          <div className="category-card" onClick={() => handleCategoryClick("Painter")}><div className="category-icon"><ImagesearchRollerIcon fontSize="large"/></div><strong>Painter</strong></div>
          <div className="category-card" onClick={() => handleCategoryClick("Plumber")}><div className="category-icon"><PlumbingIcon fontSize="large"/></div><strong>Plumber</strong></div>
          <div className="category-card" onClick={() => handleCategoryClick("Carpenter")}><div className="category-icon"><CarpenterIcon fontSize="large"/></div><strong>Carpenter</strong></div>
          <div className="category-card" onClick={() => handleCategoryClick("Handyman")}><div className="category-icon"><HandymanIcon fontSize="large"/></div><strong>Handyman</strong></div>
          <div className="category-card" onClick={() => handleCategoryClick("Builder")}><div className="category-icon"><ApartmentIcon fontSize="large"/></div><strong>Builder</strong></div>
          <div className="category-card" onClick={() => handleCategoryClick("Electrician")}><div className="category-icon"><ElectricalServicesIcon fontSize="large"/></div><strong>Electrician</strong></div>
          <div className="category-card" onClick={() => handleCategoryClick("Gardner")}><div className="category-icon"><YardIcon fontSize="large"/></div><strong>Gardner</strong></div>
          <div className="category-card" onClick={() => handleCategoryClick("Home cleaner")}><div className="category-icon"><CleaningServicesIcon fontSize="large"/></div><strong>Cleaner</strong></div>
        </div>
      </section>

      {/* 3. Search Results (Only visible if workers are found) */}
      <section id="results-section" className="results-section" style={{ display: workers.length > 0 ? 'block' : 'none' }}>
        <h2 style={{ fontSize: '2rem', color: '#111827', borderBottom: '2px solid #f97316', paddingBottom: '10px', display: 'inline-block' }}>
          Top Rated Professionals
        </h2>
        <div className="results-grid">
          {workers.map((worker) => {
             // Calculate average rating
             const avgRating = worker.reviews && worker.reviews.length > 0 
                ? (worker.reviews.reduce((acc, rev) => acc + (Number(rev.rating) || 0), 0) / worker.reviews.length).toFixed(1)
                : "New";

             return (
              <div key={worker._id} className="worker-profile-card" onClick={() => handleCardClick(worker)}>
                <img src={worker.image || worker.profileImage || "https://via.placeholder.com/300"} alt={worker.name} className="worker-img" />
                <div className="worker-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 className="worker-name">{worker.name}</h3>
                      <p className="worker-profession">{worker.profession}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fff7ed', padding: '4px 8px', borderRadius: '8px', color: '#f59e0b', fontWeight: 'bold' }}>
                      <Star size={16} fill="#f59e0b" /> {avgRating}
                    </div>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '10px' }}>
                    <p style={{ margin: '4px 0' }}><MapPin size={14} style={{display:'inline', marginBottom:'-2px'}}/> Pincode: {worker.pincode || worker.address?.pincode}</p>
                    <p style={{ margin: '4px 0', fontWeight: '600', color: '#111827' }}>₹{worker.rate} / hour</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Feature Highlights (Replaces Template Cards) */}
      <section className="features-section">
        
        <div className="feature-row">
          <div className="feature-text">
            <h2>From infrastructure to innovation, skilled labor makes it happen.</h2>
            <p style={{ color: '#6b7280', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Connect with certified professionals who bring years of experience to your doorstep. Quality work, guaranteed.
            </p>
          </div>
          <div className="feature-image">
            <img src="https://media.istockphoto.com/id/1481609175/photo/hands-holding-different-carpentry-tools-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=r04Kkq-Zl9s7R99Hg5_czQLuvFCCl1YcNJhb-uom-Tw=" alt="Carpentry Tools" />
          </div>
        </div>

        <div className="feature-row">
          <div className="feature-text">
            <h2>The beauty of creation rests in the hands of skilled artisans.</h2>
            <p style={{ color: '#6b7280', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Whether it is fixing a leak or a full renovation, our platform ensures you find the exact expertise you need in seconds.
            </p>
          </div>
          <div className="feature-image">
            <img src="https://media.istockphoto.com/id/2012813528/photo/plumber-uses-wrench-to-repair-water-pipe-under-sink-there-is-maintenance-to-fix-the-water.jpg?s=612x612&w=0&k=20&c=s60mJ-oPG-RsJa4p90deXdEotEpLkkGeuRbPFiaQGuA=" alt="Plumber Fixing Pipe" />
          </div>
        </div>

      </section>

    </div>
  );
};

export default LandingPage;