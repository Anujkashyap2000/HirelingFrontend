
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import "./userBooking.css";


import { LayoutGrid, ThumbsUp, ShoppingBag, User as UserIcon, RefreshCw , Clock, Menu, X} from "lucide-react";


import RequestedUserCard from "./comp/RequestedUserCard";
import AcceptedUserCard from "./comp/AcceptedUserCard";
import BookedOrderCard from "./comp/BookedOrderCard";
import CompletedCard from "./comp/CompletedCard";
import  CustomerService  from "../../../Service/customer";
import  orderService  from "../../../Service/order";

const UserBookings = () => {
  const navigate = useNavigate();
  const customer = useSelector((state) => state?.auth?.userData);

  const [activeTab, setActiveTab] = useState('requested');
   const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [requestedAppointments, setRequestedAppointments] = useState([]);
  const [acceptedAppointments, setAcceptedAppointments] = useState([]);
  const [bookedOrders, setBookedOrders] = useState([]);
  const [completed,setCompleted]= useState([])
  
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [cancelOrderProcessing, setCancelOrderProcessing] = useState(null);
  const [cancelOrderError, setCancelOrderError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!customer) return;
    fetchAllData();
  }, [customer]);

  const fetchAllData = async () => {
    if (!customer) return;
    setIsRefreshing(true);
    await Promise.all([
      fetchRequestedAppointments(customer._id),
      fetchAcceptedAppointments(customer._id),
      fetchBookedOrders(customer._id),
      fetchCompletedOrders(customer._id)
    ]);
    setIsRefreshing(false);
  };
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const fetchRequestedAppointments = async (id) => {
    try {
      const res = await CustomerService.fetchRequestedAppointment(id)
      setRequestedAppointments(res.data?.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchAcceptedAppointments = async (id) => {
    try {
      const res = await CustomerService.fetchAcceptedAppointment(id);
      setAcceptedAppointments(res.data?.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchCompletedOrders = async (userId) => {
    try {
      const res = await orderService.fetchCompletedOrderForCustomer(userId);
      
      
      setCompleted(res.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchBookedOrders = async (userId) => {
    try {
      const res = await orderService.fetchOrderForCustomer(userId);
      setBookedOrders(res.data || []);
    } catch (err) { console.error(err); }
  };

  const handlePlaceOrder = async (projectId) => {
    setPaymentProcessing(true);
    setPaymentError(null);
    try {
      const res = await orderService.generateOrder(projectId);
      if (res.data) {
        fetchAcceptedAppointments(customer._id);
        fetchBookedOrders(customer._id);
        setActiveTab('orders');
      } else {
        setPaymentError("Failed to place order.");
      }
    } catch (error) {
      setPaymentError("Failed to place order.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    setCancelOrderProcessing(orderId);
    setCancelOrderError(null);
    try {
      const res = await orderService.cancelOrder(orderId)
      if (res.data && res.data.status === "cancelled") {
        fetchBookedOrders(customer._id);
      } else {
        setCancelOrderError("Failed to cancel order.");
      }
    } catch (error) {
      setCancelOrderError("Failed to cancel order.");
    } finally {
      setCancelOrderProcessing(null);
    }
  };

  
 

  return (
    <div className="dashboard-container">
      <button className="mobile-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-icon"><UserIcon size={24} /></div>
          MY BOOKINGS
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className={`nav-item ${activeTab === 'requested' ? 'active' : ''}`} onClick={() => { setActiveTab('requested'); setIsSidebarOpen(false); }}>
            <LayoutGrid size={20} /> Requested ({requestedAppointments.length})
          </div>
          <div className={`nav-item ${activeTab === 'accepted' ? 'active' : ''}`} onClick={() => { setActiveTab('accepted'); setIsSidebarOpen(false); }}>
            <ThumbsUp size={20} /> Accepted ({acceptedAppointments.length})
          </div>
          <div className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }}>
            <ShoppingBag size={20} /> Active Orders ({bookedOrders.length})
          </div>

          <div className={`nav-item ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => { setActiveTab('completed'); setIsSidebarOpen(false); }}>
            <Clock size={20} /> History ({completed.length})
          </div>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button 
            className="btn btn-outline" 
            onClick={fetchAllData} 
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? "spin" : ""} /> 
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </aside>
    {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
      {/* Main Content Area */}
      <main className="main-content">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#111827' }}>
              {activeTab === 'requested' && "Pending Requests"}
              {activeTab === 'accepted' && "Ready for Payment"}
              {activeTab === 'orders' && "Your Active Orders"}
              {activeTab === 'completed' && "Your Completed Orders"}
            </h1>
        </div>

        {/* Tab: Requested */}
        {activeTab === 'requested' && (
          <div className="grid-container">
            {requestedAppointments.length === 0 ? <p>You have no pending requests.</p> : 
              requestedAppointments.map(app => (
                <RequestedUserCard key={app._id} app={app} />
              ))
            }
          </div>
        )}

        {/* Tab: Accepted */}
        {activeTab === 'accepted' && (
          <>
            {paymentError && <div style={{ padding: '10px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '15px' }}>{paymentError}</div>}
            <div className="grid-container">
              {acceptedAppointments.length === 0 ? <p>No accepted appointments waiting for order.</p> : 
                acceptedAppointments.map(app => (
                  <AcceptedUserCard 
                    key={app._id} 
                    app={app} 
                    onPlaceOrder={handlePlaceOrder} 
                    isProcessing={paymentProcessing} 
                  />
                ))
              }
            </div>
          </>
        )}

        {/* Tab: Booked Orders */}
        {activeTab === 'orders' && (
          <>
            {cancelOrderError && <div style={{ padding: '10px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '15px' }}>{cancelOrderError}</div>}
            <div className="grid-container">
              {bookedOrders.length === 0 ? <p>You have no active orders.</p> : 
                bookedOrders.map(order => (
                  <BookedOrderCard 
                    key={order._id} 
                    order={order} 
                    onCancel={handleCancelOrder}
                    cancelProcessing={cancelOrderProcessing}
                  />
                ))
              }
            </div>
          </>
        )}

        {/* Tab: Completed Orders */}
        {activeTab === 'completed' && (
          <>
            {cancelOrderError && <div style={{ padding: '10px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '15px' }}>{cancelOrderError}</div>}
            <div className="grid-container">
              {completed.length === 0 ? <p>You have not complete any orders.</p> : 
                completed.map(order => (
                  <CompletedCard 
                    key={order._id} 
                    order={order} 
                  />
                ))
              }
            </div>
          </>
        )}

      </main>
    </div>
  );
};

export default UserBookings;
