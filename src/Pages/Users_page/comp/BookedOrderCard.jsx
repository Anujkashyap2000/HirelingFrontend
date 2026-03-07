import React from 'react';
import { Link } from 'react-router-dom';
import ReviewForm from '../ReviewForm'; 
import { FileText, ShieldCheck, Calendar } from 'lucide-react';

const BookedOrderCard = ({ order, onCancel, cancelProcessing }) => {
  const isStarted = order.orderStatus === "started";
  const isCompleted = order.orderStatus === "completed";


  const getBadgeStyle = (status) => {
    const baseStyle = {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '700',
      textTransform: 'capitalize',
      whiteSpace: 'nowrap',
    };

    switch (status.toLowerCase()) {
      case 'pending':
      case 'ordered':
        return { ...baseStyle, background: '#dbeafe', color: '#1e40af' };
      case 'started':
        return { ...baseStyle, background: '#fef3c7', color: '#92400e' };
      case 'completed':
        return { ...baseStyle, background: '#d1fae5', color: '#065f46' };
      case 'cancelled':
        return { ...baseStyle, background: '#fee2e2', color: '#991b1b' };
      default:
        return { ...baseStyle, background: '#f3f4f6', color: '#374151' };
    }
  };


  const styles = {
    card: {
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb',
      borderLeft: '5px solid #10b981', 
      overflow: 'hidden',
      marginBottom: '20px',
      display: 'flex',
      flexDirection: 'column',
    },
    cardBody: {
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
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
    workerName: {
      fontSize: '0.85rem',
      color: '#6b7280',
    },
    metaInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginBottom: '20px',
    },
    metaRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#4b5563',
      fontSize: '0.95rem',
    },
    verificationBox: {
      background: '#f8fafc',
      border: '1px dashed #cbd5e1',
      borderRadius: '8px',
      padding: '12px 15px',
      marginBottom: '20px',
    },
    verificationContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: '#475569',
      fontSize: '0.9rem',
      fontWeight: '500',
      flexWrap: 'wrap', 
    },
    verificationCode: {
      margin: '0 0 0 auto',
      fontSize: '1.2rem',
      fontWeight: '800',
      letterSpacing: '2px',
      color: '#0f172a',
      background: '#e2e8f0',
      padding: '4px 10px',
      borderRadius: '6px',
    },
    reviewBox: {
      background: '#fef3c7',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #fde68a',
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
      display: 'inline-block',
      textDecoration: 'none',
      flex: '1 1 140px', 
      boxSizing: 'border-box',
    },
    btnDanger: {
      background: '#fee2e2',
      color: '#dc2626',
    },
    btnOutline: {
      background: 'transparent',
      border: '1px solid #d1d5db',
      color: '#374151',
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardBody}>
        
        <div style={styles.header}>
          <div>
            <h3 style={styles.title}>Order #{order.orderId}</h3>
            <span style={styles.workerName}>
              Worker: <strong style={{ color: '#374151' }}>{order.workerId?.name}</strong>
            </span>
          </div>
          <span style={getBadgeStyle(order.orderStatus)}>
            {order.orderStatus}
          </span>
        </div>

      
        <div style={styles.metaInfo}>
          <div style={styles.metaRow}>
            <FileText size={16} /> 
            <span>Total Amount: <strong>₹{order.totalAmount}</strong></span>
          </div>
          <div style={styles.metaRow}>
            <Calendar size={16} /> 
            <span>Booked On: {new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

     
        {!isCompleted && !isStarted && (
           <div style={styles.verificationBox}>
             <div style={styles.verificationContent}>
                <ShieldCheck size={18} color="#10b981" /> 
                <span>Give this code to your worker:</span>
                <p style={styles.verificationCode}>{order.verificationCode}</p>
             </div>
           </div>
        )}


        <div>
          {isStarted && !isCompleted ? (
            <div style={styles.reviewBox}>
              <h4 style={{ margin: '0 0 15px 0', color: '#92400e', fontSize: '1rem' }}>
                Job Started! Rate your experience:
              </h4>
              <ReviewForm orderId={order._id} />
            </div>
          ) : (
            <div style={styles.buttonGroup}>
              {!isCompleted && (
                <button 
                  style={{ 
                    ...styles.btnBase, 
                    ...styles.btnDanger, 
                    opacity: cancelProcessing === order._id ? 0.6 : 1,
                    cursor: cancelProcessing === order._id ? 'not-allowed' : 'pointer'
                  }} 
                  onClick={() => onCancel(order._id)} 
                  disabled={cancelProcessing === order._id}
                >
                  {cancelProcessing === order._id ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
              <Link 
                to={`/orders/${order.orderId}`} 
                style={{ ...styles.btnBase, ...styles.btnOutline }}
              >
                View Details
              </Link>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default BookedOrderCard;