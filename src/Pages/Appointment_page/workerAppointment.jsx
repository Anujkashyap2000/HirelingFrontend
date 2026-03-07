
import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./workerAppointment.css";

import { 
  Briefcase, Star, Clock, IndianRupee, MessageSquare, User, CalendarCheck 
} from "lucide-react";

const WorkerAppointment = () => {
  const { workerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();


  const { 
    name, 
    profession, 
    image, 
    experiance, 
    rate, 
    description, 
    reviews = [] 
  } = location.state || {};



  if (!name) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Worker details not found.</h2>
        <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', cursor: 'pointer' }}>Go Back</button>
      </div>
    );
  }

 
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + (Number(rev.rating) || 0), 0) / reviews.length).toFixed(1)
    : "No Ratings Yet";


  const handleAppointment = () => {
    navigate(`/appointment-request/${workerId}`, {
      state: {
        worker: {
          _id: workerId,
          name,
          profession,
          image,
          experiance,
          rate,
          description,
          reviews
        }
      }
    });
  };


  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          fill={i < rating ? "#f59e0b" : "transparent"} 
          color={i < rating ? "#f59e0b" : "#cbd5e1"} 
        />
      );
    }
    return stars;
  };

  return (
    <div className="profile-page-wrapper">
      <div className="profile-layout-grid">
        
        <div className="profile-main-content">
          
          <div className="worker-header-info">
            <h1>{name}</h1>
            <div className="profession-badge">
              <Briefcase size={18} /> {profession}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontWeight: '600' }}>
              <Star fill="#f59e0b" color="#f59e0b" size={20} /> 
              <span style={{ color: '#0f172a' }}>{avgRating}</span> 
              ({reviews.length} reviews)
            </div>
          </div>

          <div className="about-section">
            <h2 className="section-heading"><User size={22} /> About Me</h2>
            <p className="about-text">
              {description || "This professional has not provided a description yet. However, they are verified and ready to take on your tasks."}
            </p>
          </div>

          <div className="reviews-section">
            <h2 className="section-heading"><MessageSquare size={22} /> Client Reviews</h2>
            
            {reviews.length === 0 ? (
              <p style={{ color: '#64748b', fontStyle: 'italic' }}>This worker hasn't received any reviews yet. Be the first to book them!</p>
            ) : (
              <div className="review-list">
                {reviews.map((rev, index) => (
                  <div key={index} className="review-card">
                    <h6>By {rev.author.name}</h6>
                    <div className="review-stars">
                      {renderStars(Number(rev.rating))}
                    </div>
                    <p className="review-comment">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="profile-sidebar">
          <div className="booking-card">
            
            <img 
              src={image || "https://via.placeholder.com/200"} 
              alt={name} 
              className="booking-card-img" 
            />
            
            <div className="booking-price">
              ₹{rate} <span>/ hour</span>
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <div className="booking-meta-row">
                <span><Clock size={16} style={{display:'inline', marginBottom:'-3px',color:'#f97316'}}/> Experience</span>
                <strong>{experiance} Years</strong>
              </div>
              
              <div className="booking-meta-row">
                <span><IndianRupee size={16} style={{display:'inline', marginBottom:'-3px', color:'#f97316'}}/> Base Rate</span>
                <strong>₹{rate}/hr</strong>
              </div>
            </div>

            <button className="btn-book-now" onClick={handleAppointment}>
              Request Appointment <CalendarCheck size={20} />
            </button>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '12px' }}>
              You won't be charged yet
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default WorkerAppointment;