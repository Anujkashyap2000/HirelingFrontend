import React from 'react';
import { WorkerMap } from '../../../Components/WorkerMap'; // Adjust path if needed

const ActiveJobCard = ({ job, workerRole }) => {
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
          <strong>Data And Time: </strong> {new Date(job.projectId.preferredDateAndTime).toLocaleString()}
          
        </p>

    
        {workerRole === 'WORKER' && job.projectId?.address?.location && (
          <div style={{ height: '400px', marginTop: '10px', borderRadius: '8px', overflow: 'hidden', background: '#eee' }}>
             <WorkerMap 
                appointmentId={job._id}
                venueLoc={job.projectId.address.location.coordinates}
             />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveJobCard;