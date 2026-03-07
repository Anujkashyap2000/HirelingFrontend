import React,{useState,useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderPage() {
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  console.log("booking");
  const location = useLocation();
  const navigate = useNavigate();
  const project = location.state?.app || [];
  console.log(project);


  return (
    <div>
      <div>
        <div className="appointment">
          <div>
            <h1>Booking</h1>
            <img
              src={project.workImage}
              alt="Work"
              style={{ width: "50rem" }}
            />
            <p>{project.description}</p>
            <p>
              <strong>WorkPlace Address:</strong>{" "}
              {project.address.houseAddress +
                "," +
                project.address.city +
                "," +
                project.address.state}
            </p>
            <p>
              <strong>Worker:</strong> {project.workerInfo[0].name}
            </p>
            <p>
              <strong>Profession:</strong> {project.workerInfo[0].profession}
            </p>

            <p>
              <strong>Preferred Date And Time:</strong>{" "}
              {new Date(project.preferredDateAndTime).toLocaleString()}
            </p>
            <p>
              <strong>Required Time:</strong> {project.requiredTime}
            </p>
            <p>
              <strong>Amount:</strong>&#8377; {project.amount}
            </p>

            <div>
            <p className="status">Status: {project.status || "Accepted"}</p>
            {project.status !== "ordered" && (
              <button
                onClick={() => handlePlaceOrder(project)}
                disabled={paymentProcessing}
              >
                {paymentProcessing ? "Placing Order..." : "Place Order"}
              </button>
            )}
            {paymentError && <p className="error-message">{paymentError}</p>}
          </div>
          </div>
          

          <div></div>
        </div>
      </div>
    </div>
  );
}
