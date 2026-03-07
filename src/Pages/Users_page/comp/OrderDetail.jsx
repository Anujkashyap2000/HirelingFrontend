import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderDetail.css';

import { 
  ArrowLeft, MapPin, Clock, Calendar, User, 
  CreditCard, ShieldCheck, Image as ImageIcon, Briefcase, FileText
} from 'lucide-react';
import  orderService  from '../../../../Service/order';

const OrderDetail = () => {
  const { orderId } = useParams(); 
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await orderService.fetchOrderDetail(orderId)

      
      setOrder(res.data[0]);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load order details. It may have been deleted or the network is down.");
      setLoading(false);
    }
  };

  if (loading) return <div className="order-detail-wrapper"><div className="order-detail-container">Loading Order Details...</div></div>;
  if (error) return <div className="order-detail-wrapper"><div className="order-detail-container"><h2 style={{color: 'red'}}>{error}</h2><button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft/> Go Back</button></div></div>;
  if (!order) return null;

  const worker = order.workerId || {};
  const project = order.projectId || {};
  const address = project.address || {};
  const isCompleted = order.orderStatus === 'completed';

  return (
    <div className="order-detail-wrapper">
      <div className="order-detail-container">
        
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back to My Bookings
        </button>

        <div className="page-header">
          <div>
            <h1>Order #{order.orderId || orderId}</h1>
            <p style={{ color: '#6b7280', margin: '8px 0 0 0' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <span className={`badge ${order.orderStatus?.toLowerCase()}`}>
            {order.orderStatus}
          </span>
        </div>

        <div className="detail-grid">
          
          <div className="left-col">
            
            <div className="detail-card">
              <h2 className="card-heading"><User size={20} /> Assigned Worker</h2>
              <div className="worker-profile-row">
                <img 
                  src={worker.profileImage || "https://via.placeholder.com/150"} 
                  alt={worker.name} 
                  className="worker-avatar"
                />
                <div className="worker-info">
                  <h3>{worker.name || "Worker Name"}</h3>
                  <p><Briefcase size={14} style={{display: 'inline', marginBottom: '-2px'}}/> {worker.profession || "Professional"}</p>
                </div>
              </div>
            </div>

            <div className="detail-card">
              <h2 className="card-heading"><FileText size={20} /> Job Details</h2>
              
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontWeight: '600', margin: '0 0 8px 0' }}>Description:</p>
                <p style={{ color: '#4b5563', lineHeight: '1.6', margin: 0 }}>
                  {project.description || "No description provided by the customer during booking."}
                </p>
              </div>

              {project.workImage && (
                <div>
                  <p style={{ fontWeight: '600', margin: '0 0 8px 0', display: 'flex', gap:'5px', alignItems:'center' }}>
                    <ImageIcon size={16}/> Reference Image:
                  </p>
                  <img 
                    src={project.workImage} 
                    alt="Job Reference" 
                    style={{ width: '100%', maxWidth: '300px', borderRadius: '12px', border: '1px solid #e5e7eb' }} 
                  />
                </div>
              )}
            </div>
          </div>

          <div className="right-col">
            
            <div className="detail-card">
              <h2 className="card-heading"><Calendar size={20} /> Schedule & Location</h2>
              
              <div className="info-row">
                <Calendar className="info-icon" size={20} />
                <div className="info-content">
                  <p>Scheduled Date & Time</p>
                  <span>{new Date(project.preferredDateAndTime).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <div className="info-row">
                <Clock className="info-icon" size={20} />
                <div className="info-content">
                  <p>Estimated Duration</p>
                  <span>{project.requiredTime} Hours</span>
                </div>
              </div>

              <div className="info-row">
                <MapPin className="info-icon" size={20} />
                <div className="info-content">
                  <p>Service Address</p>
                  <span>
                    {address.houseAddress && `${address.houseAddress}, `}
                    {address.city && `${address.city}, `}
                    {address.state && `${address.state}`}
                  </span>
                </div>
              </div>
            </div>

            {!isCompleted && order.orderStatus !== 'cancelled' && (
              <div className="detail-card" style={{ border: '2px solid #bbf7d0', padding: '20px' }}>
                <h2 className="card-heading" style={{ borderBottom: 'none', marginBottom: '0', color: '#166534' }}>
                  <ShieldCheck size={20} /> Security Verification
                </h2>
                <div className="verify-alert">
                  <h4>Share this code with the worker to start the job:</h4>
                  <p className="verify-code-large">{order.verificationCode || "----"}</p>
                </div>
              </div>
            )}

            <div className="detail-card">
              <h2 className="card-heading"><CreditCard size={20} /> Payment Summary</h2>
              
              <div className="payment-row">
                <span>Service Fee</span>
                <span>₹{order.totalAmount}</span>
              </div>
              <div className="payment-row">
                <span>Platform Fee</span>
                <span>Included</span>
              </div>
              
              <div className="payment-total">
                <span>Total Amount</span>
                <span>₹{order.totalAmount}</span>
              </div>
              
              <div style={{ marginTop: '16px', fontSize: '0.85rem', color: '#6b7280', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                 <ShieldCheck size={14}/> 
                 Payment Status: <strong style={{color: '#111827', textTransform: 'capitalize'}}>{order.paymentDetails?.status || 'Pending'}</strong>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetail;