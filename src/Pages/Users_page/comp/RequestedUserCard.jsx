import React from 'react';
import { MapPin, Clock, Calendar, Clock4 } from 'lucide-react';
import  ProjectService  from '../../../../Service/project';
import { useNavigate } from 'react-router-dom';


const RequestedUserCard = ({ app }) => {
  const navigate= useNavigate()
  const handleDelete = async (projectId) => {
    console.log(projectId);
    
    const res=await ProjectService.deleteAppointment(projectId)
    if (res.status === 200) {
        toast.success("Appointment is Deleting");
      } else {
        toast.error("Something went wrong while deleting ");
        return;
      }
  };

  const handleUpdate = (app) => {
    
    
    navigate("/updateProject", { state: { app } });
  };

  

  const styles = {
    card: {
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      marginBottom: '20px',
      display: 'flex',
      flexDirection: 'column',
      width:"100%",
      maxWidth:"600px"
    },
    img: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
    },
    cardBody: {
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      borderBottom: '1px solid #f3f4f6',
      paddingBottom: '15px',
      marginBottom: '15px',
      flexWrap: 'wrap',
      gap: '10px',
    },
    title: {
      margin: '0 0 5px 0',
      fontSize: '1.15rem',
      color: '#111827',
      fontWeight: '700',
    },
    profession: {
      fontSize: '0.85rem',
      color: '#6b7280',
    },
    price: {
      fontSize: '1.25rem',
      fontWeight: '800',
      color: '#f97316',
    },
    metaSection: {
      marginBottom: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    metaRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#4b5563',
      fontSize: '0.95rem',
    },
    statusRow: {
      marginTop: 'auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '10px',
      paddingBottom: '15px',
      borderBottom: '1px solid #f3f4f6',
      marginBottom: '15px',
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '700',
      background: '#fef3c7', // Yellow warning color for pending
      color: '#b45309',
    },
    dateText: {
      fontSize: '0.75rem',
      color: '#9ca3af',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      width: '100%',
      flexWrap: 'wrap', 
    },
    btnBase: {
      padding: '10px 16px',
      borderRadius: '6px',
      fontSize: '0.95rem',
      fontWeight: '600',
      cursor: 'pointer',
      border: 'none',
      textAlign: 'center',
      flex: '1 1 120px', 
      boxSizing: 'border-box',
    },
    btnEdit: {
      background: 'transparent',
      border: '1px solid #d1d5db',
      color: '#374151',
    },
    btnDelete: {
      background: '#fee2e2',
      color: '#dc2626',
    }
  };

  return (
    <div style={styles.card}>
      <img 
        src={app.workImage || "https://via.placeholder.com/400x200"} 
        alt="Work" 
        style={styles.img} 
      />
      
      <div style={styles.cardBody}>
     
        <div style={styles.header}>
          <div>
            <h3 style={styles.title}>Worker: {app.workerInfo[0]?.name}</h3>
            <span style={styles.profession}>{app.workerInfo[0]?.profession}</span>
          </div>
          <div style={styles.price}>₹{app.amount}</div>
        </div>

     
        <div style={styles.metaSection}>
          <div style={styles.metaRow}>
            <MapPin size={16} /> 
            <span>{app.address?.city}, {app.address?.state}</span>
          </div>
          <div style={styles.metaRow}>
            <Clock size={16} /> 
            <span>{app.requiredTime} Hours Needed</span>
          </div>
          <div style={styles.metaRow}>
            <Calendar size={16} /> 
            <span>{new Date(app.preferredDateAndTime).toLocaleString()}</span>
          </div>
        </div>


        <div style={styles.statusRow}>
          <span style={styles.statusBadge}>
            <Clock4 size={14} /> Pending Response
          </span>
          <span style={styles.dateText}>
            Requested on {new Date(app.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div  style={styles.buttonGroup}>
          <button onClick={()=>handleUpdate(app)} style={{ ...styles.btnBase, ...styles.btnEdit }}>
            Edit
          </button>
          <button 
            onClick={() => handleDelete(app._id)} 
            style={{ ...styles.btnBase, ...styles.btnDelete }}
          >
            Delete
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default RequestedUserCard;