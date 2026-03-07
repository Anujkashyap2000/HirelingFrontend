import React from 'react';
import { MapPin, Clock, Calendar, CheckCircle } from 'lucide-react';

const AcceptedUserCard = ({ app, onPlaceOrder, isProcessing }) => {
  return (
    <div className="job-card" style={{ borderLeft: '4px solid #2563eb' }}>
      <img src={app.workImage || "https://via.placeholder.com/200"} alt="Work" className="card-img" />
      <div className="card-body">
        <div className="card-header">
          <div>
            <h3 className="card-title">{app.workerInfo[0]?.name}</h3>
            <span className="status-badge status-accepted" style={{ marginTop: '4px' }}>
              <CheckCircle size={12} /> Worker Accepted
            </span>
          </div>
          <div className="card-price">₹{app.amount}</div>
        </div>

        <div style={{ marginBottom: '16px', marginTop: '10px' }}>
          <div className="meta-row"><MapPin size={14} /> {app.address?.city}</div>
          <div className="meta-row"><Clock size={14} /> {app.requiredTime} Hours Needed</div>
          <div className="meta-row"><Calendar size={14} /> {new Date(app.preferredDateAndTime).toLocaleString()}</div>
        </div>

        <div style={{ marginTop: 'auto' }}>
          {app.status !== "ordered" && (
            <button className="btn btn-primary" onClick={() => onPlaceOrder(app._id)} disabled={isProcessing}>
              {isProcessing ? "Processing Payment..." : "Confirm & Place Order"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptedUserCard;