import React,{useState,useEffect} from "react";
import socket from "../socket";
import toast from "react-hot-toast";

 const CustomerStatus = ({ appointmentId }) => {
    const [status, setStatus] = useState("Payment Confirmed");
    const [isWorkerMoving, setIsWorkerMoving] = useState(false);

    useEffect(() => {
        socket.emit("join_tracking", { appointmentId });

        socket.on("location_received", () => {
            setIsWorkerMoving(true);
            setStatus("Worker is Navigating to You");
        });

        socket.on("job_finished", () => {
            setStatus("Job Completed");
            toast.success("Worker has marked the job as finished!");
        });
    }, [appointmentId]);

    return (
        <div className="status-container">
            <div className="status-badge">Step 1: Advance Payment ✅</div>
            <div className={`status-badge ${isWorkerMoving ? 'active' : ''}`}>
                Step 2: Worker Tracking {isWorkerMoving ? '🚚' : '⏳'}
            </div>
            <div className="status-text">{status}</div>
        </div>
    );
};

export default CustomerStatus;