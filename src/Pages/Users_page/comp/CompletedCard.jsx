import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, CheckCircle } from 'lucide-react';

const CompletedCard = ({ order }) => {
  const getBadgeStyle = (status) => {
    const baseStyle = {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '700',
      textTransform: 'capitalize',
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
    };

    if (status.toLowerCase() === 'completed') {
      return { ...baseStyle, background: '#d1fae5', color: '#065f46' };
    }
    return { ...baseStyle, background: '#f3f4f6', color: '#374151' };
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
    btnContainer: {
      marginTop: 'auto',
      width: '100%',
    },
    btnOutline: {
      padding: '10px 16px',
      borderRadius: '6px',
      fontSize: '0.95rem',
      fontWeight: '600',
      background: 'transparent',
      border: '1px solid #d1d5db',
      color: '#374151',
      textAlign: 'center',
      display: 'block', 
      width: '100%',
      textDecoration: 'none',
      boxSizing: 'border-box',
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
            {order.orderStatus.toLowerCase() === 'completed' && <CheckCircle size={14} />}
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

        <div style={styles.btnContainer}>
          <Link to={`/orders/${order.orderId}`} style={styles.btnOutline}>
            View Details
          </Link>
        </div>
            
      </div>
    </div>
  );
};

export default CompletedCard;