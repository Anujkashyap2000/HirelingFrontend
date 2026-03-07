import React from 'react';
import { MapPin, Clock, Calendar } from 'lucide-react';

const RequestCard = ({ request, onAccept, onReject }) => {
  return (
    <div className="job-card">
      <img src={request.workImage || "https://via.placeholder.com/200"} alt="Job" className="card-img" />
      <div className="card-body">
        <div className="card-header">
          <div>
            <h3 className="card-title">{request.description}</h3>
            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              Request from <span style={{ color: '#f97316', fontWeight: '600' }}>{request.customerInfo[0]?.name}</span>
            </span>
          </div>
          <div className="card-price">₹{request.amount}</div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div className="meta-row"><MapPin size={14} /> {request.address?.city}</div>
          <div className="meta-row"><Clock size={14} /> {request.requiredTime} Hours</div>
          <div className="meta-row"><Calendar size={14} /> {new Date(request.preferredDateAndTime).toLocaleString()}</div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
          <button onClick={() => onAccept(request._id)} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            Accept Request
          </button>
          <button onClick={() => onReject(request._id)} className="btn btn-reject" style={{ flex: 1, justifyContent: 'center' }}>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;