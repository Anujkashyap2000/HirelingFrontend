
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useSelector } from 'react-redux';
import socket from '../../socket'; // Adjust path
import './WorkerProfile.css';

// Import Icons
import { LayoutGrid, Briefcase, Clock, CheckCircle, Navigation, CreditCard, ShieldCheck,ThumbsUp,ClockFading, Menu, X } from 'lucide-react';

// Import Sub-Components
import DashboardHeader from './Comp/DashboardHeader';
import RequestCard from './Comp/RequestCard';
import ActiveJobCard from './Comp/ActiveJobCard';
import AcceptedCard from './Comp/AcceptedRequest';
import Verified from './Comp/Verified';
import CompletedCard from './Comp/CompletedCard';
import  workerService  from '../../../Service/worker';
import  orderService  from '../../../Service/order';
const WorkerProfile = () => {
  const navigate = useNavigate();
  const workerData = useSelector((state) => state?.auth?.userData);
  
  // -- State Management --
  const [activeTab, setActiveTab] = useState('requests');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [status, setStatus] = useState(workerData?.status);
  const [requests, setRequests] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [accepted,setAccepted]= useState([]);
  const [completed, setCompleted] = useState([])
  const [ verified, setVerified] = useState([])
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!workerData) return;
    fetchData();
    
    socket.emit("join_room", workerData._id);
    socket.on("new_booking_notification", () => {
      alert("🔔 New Booking Request!");
      fetchData();
    });
    return () => socket.off("new_booking_notification");
  }, [workerData]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const fetchData = async () => {
    try {
      const [reqRes, activeRes, acceptedRes, completedRes, verifiedRes] = await Promise.all([
        workerService.fetchAppointmentRequestForWorker(workerData._id),
        orderService.fetchOrderForWorker(workerData._id),
        workerService.fetchAcceptedAppointmentForWorker(workerData._id),
        orderService.fetchCompletedOrderForWorker(workerData._id),
        orderService.fetchVerifiedOrderForWorker(workerData._id),
        
      ]);
      setRequests(reqRes.data?.data || []);
      setActiveJobs(activeRes.data || []);      
      setAccepted(acceptedRes?.data?.data||[])
      setCompleted(completedRes?.data || [])
      setVerified(verifiedRes?.data || [])
     
      
    } catch (err) { console.error(err); }
  };

  const toggleStatus = async () => {
    const res = await workerService.toggleStatus(workerData._id);
    setStatus(res.data.data.status);
  };

  const handleAccept = async (id) => {
    await workerService.acceptAppointment(id);
    fetchData(); 
  };

  const handleReject = async (id) => {
    await workerService.rejectAppointment(id);;
    fetchData(); 
  };

   const handleUnaccept = async (appointmentId) => {
        try {
            await workerService.unAcceptAppointment(appointmentId);;
            fetchData();
           
        } catch (err) {
            console.error('Error unaccepting request:', err);
        }
    };

  const handleVerify = async () => {
    try {
      const res = await orderService.verify(verificationCode);
      console.log(res);
      
      setMessage(res.data.message);
      setVerificationCode('');
      fetchData();
    } catch (err) { setMessage('Verification Failed'); }
  };

  return (
    <div className="dashboard-container">
      <button className="mobile-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => { setActiveTab('requests'); setIsSidebarOpen(false); }}>
            <LayoutGrid size={20} /> Requests ({requests.length})
          </div>
          <div className={`nav-item ${activeTab === 'accepted' ? 'active' : ''}`} onClick={() => { setActiveTab('accepted'); setIsSidebarOpen(false); }}>
            <ThumbsUp size={20} /> Accepted Appointment ({accepted.length})
          </div>
          
          <div className={`nav-item ${activeTab === 'active' ? 'active' : ''}`} onClick={() => { setActiveTab('active'); setIsSidebarOpen(false); }}>
            <Clock size={20} /> Active Jobs ({activeJobs.length})
          </div>
          
          <div className={`nav-item ${activeTab === 'verified' ? 'active' : ''}`}onClick={() => { setActiveTab('verified'); setIsSidebarOpen(false); }}>
            <ClockFading size={20} /> Verified ({verified.length})
            
          </div>
          <div className={`nav-item ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => { setActiveTab('completed'); setIsSidebarOpen(false); }}>
            <CheckCircle size={20} /> History ({completed.length})
          </div>
          
        </nav>
      </aside>
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
      <main className="main-content">
        <DashboardHeader 
          workerData={workerData} 
          status={status} 
          onToggleStatus={toggleStatus}
          onUpdateProfile={() => navigate('/updateWorker')}
        />
        
        {activeTab === 'requests' && (
          <>
            <h2 style={{ marginBottom: '20px' }}>Available Requests ({requests.length})</h2>
            <div className="grid-container">
              {requests.length === 0 ? <p>No new requests available.</p> : 
                requests.map(req => (
                  <RequestCard key={req._id} request={req} onAccept={handleAccept} onReject={handleReject} />
                ))
              }
            </div>

            
          </>
        )}

        {activeTab === 'accepted' && (
          <>
            <h2 style={{ marginBottom: '20px' }}>Accepted Requests ({requests.length})</h2>
            <div className="grid-container">
              {accepted.length === 0 ? <p>No Accepted Project available.</p> : 
                accepted.map(req => (
                  <AcceptedCard key={req._id} request={req} onUnaccept={handleUnaccept} onReject={handleReject} />
                ))
              }
            </div>

            
          </>
        )}

        

        {activeTab === 'active' && (
          <>
            <h2>Active Jobs </h2>
            <h3>After Reaching to the destination verify yourself by asking verification code to the customer</h3>
            <div className="grid-container">
              {activeJobs.map(job => (
                <ActiveJobCard key={job._id} job={job} workerRole={workerData.role} />
              ))}
            </div>
          </>
        )}

        {activeTab === 'verified' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '40px' }}>
              <div className="verify-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: '#1e40af' }}>
                  <ShieldCheck size={28} />
                  <h3>Quick Verify Order</h3>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input 
                    className="verify-input" 
                    placeholder="ENTER 6-DIGIT CODE" 
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                  />
                  <button className="btn btn-primary" onClick={handleVerify}>Verify & Start</button>
                </div>
                {message && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{message}</p>}
              </div>

              <div className="payout-widget">
                 <div style={{ background: '#ffedd5', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                    <CreditCard color="#f97316" />
                 </div>
                 <div className="payout-amount">₹8,450</div>
                 <div style={{ color: '#9a3412', fontWeight: '600' }}>Pending Payout</div>
              </div>
            </div>

            <h2>Verified Jobs</h2>
            <div className="grid-container">
              {verified.length === 0 ? <p>No Verified Project .</p> : verified.map(job => (
                <Verified key={job._id} job={job} workerRole={workerData.role} />
              ))}
            </div>
          </>
        )}

        {activeTab === 'completed' && (
          <>
            <h2>Completed Jobs</h2>
            <div className="grid-container">
              {completed.length === 0 ? <p>There is No Project completed yet.</p> : completed.map(job => (
                <CompletedCard key={job._id} job={job} workerRole={workerData.role} />
              ))}
            </div>
          </>
        )}

      </main>
    </div>
  );
};

export default WorkerProfile;