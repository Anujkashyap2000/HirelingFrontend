import React from 'react';


const CompletedCard = ({ job, workerRole }) => {
  return (
    <div className="job-card" style={{ borderLeft: '4px solid #f97316' }}>
      <div className="card-body">
        <div className="card-header">
          <h3 className="card-title">Order #{job.orderId}</h3>
          <span style={{ background: '#fff7ed', color: '#f97316', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            {job.orderStatus}
          </span>
        </div>
        
        <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>
          <strong>Customer:</strong> {job.customerId?.name} <br/>
          <strong>Job Description:</strong> {job.projectId?.description} <br/>
          <strong>Address:</strong> {job.projectId?.address?.houseAddress}, {job.projectId?.address?.city} <br />
          <strong>Amount:</strong> {job.projectId?.amount} <br/>

          
        </p>

      </div>
    </div>
  );
};

export default CompletedCard;