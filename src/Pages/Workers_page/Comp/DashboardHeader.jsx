import React from 'react';
import { Wrench, MapPin } from 'lucide-react';

const DashboardHeader = ({ workerData, status, onToggleStatus, onUpdateProfile }) => {
  return (
    <div className="header-card">
      <div className="profile-section">
        <img src={workerData?.profileImage } alt="Profile" className="profile-img" />
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{workerData?.name}</h1>
          <p style={{ color: '#6b7280', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Wrench size={14} /> {workerData?.profession} • <MapPin size={14} /> {workerData?.address?.city}
          </p>
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className={`status-badge ${status !== 'active' ? 'inactive' : ''}`}>
              {status === 'active' ? '● ACTIVE & READY' : '○ INACTIVE'}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#f59e0b' }}>★ 4.8 Rating</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={onToggleStatus} className="btn btn-outline">
          {status === 'active' ? 'Deactivate' : 'Activate'}
        </button>
        <button onClick={onUpdateProfile} className="btn btn-primary">
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;