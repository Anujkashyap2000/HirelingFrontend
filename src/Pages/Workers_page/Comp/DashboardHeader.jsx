import React from 'react';
import { Wrench, MapPin } from 'lucide-react';

const DashboardHeader = ({ workerData, status, onToggleStatus, onUpdateProfile }) => {
  

 
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap', /* Allows children to drop to a new line on small screens */
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      width: '100%',
      boxSizing: 'border-box',
      gap: '1.5rem'
    }}>
      
      {/* --- Profile Section --- */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
        flex: '1 1 300px' /* Grows to fill space, shrinks, but wraps if less than 300px */
      }}>
        <img 
          src={workerData?.profileImage || "https://via.placeholder.com/100"} 
          alt="Profile" 
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '8px',
            objectFit: 'cover',
            border: '1px solid #e5e7eb'
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#111827' }}>
            {workerData?.name}
          </h1>
          <p style={{
            color: '#6b7280',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            flexWrap: 'wrap'
          }}>
            <Wrench size={14} /> {workerData?.profession} • <MapPin size={14} /> {workerData?.address?.city}
          </p>
          <div style={{
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              backgroundColor: status === 'active' ? '#dcfce7' : '#f3f4f6',
              color: status === 'active' ? '#166534' : '#374151',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              {status === 'active' ? '● ACTIVE & READY' : '○ INACTIVE'}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#f59e0b' }}>
              ★ 4.8 Rating
            </span>
          </div>
        </div>
      </div>
      
      {/* --- Action Buttons --- */}
      <div style={{
        display: 'flex',
        gap: '10px',
        flex: '1 1 200px' /* Wraps to the next line and fills width on mobile */
      }}>
        <button 
          onClick={onToggleStatus} 
          style={{
            flex: 1, /* Makes the button stretch equally on mobile */
            padding: '10px 15px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            backgroundColor: '#ffffff',
            color: '#374151',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          {status === 'active' ? 'Deactivate' : 'Activate'}
        </button>
        <button 
          onClick={onUpdateProfile} 
          style={{
            flex: 1, /* Makes the button stretch equally on mobile */
            padding: '10px 15px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#f97316', /* Your Hireling Orange */
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Update Profile
        </button>
      </div>
      
    </div>
  );
};

export default DashboardHeader;