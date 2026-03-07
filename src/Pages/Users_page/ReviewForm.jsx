
import axios from "axios";
import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import "./ReviewForm.css";
import orderService from "../../../Service/order";

const ReviewForm = ({ orderId, onSuccess }) => {
  const [review, setReview] = useState({
    rate: "",
    comment: "",
    completionCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "completionCode") {
      value = value.toUpperCase();
    }
    setReview({ ...review, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = orderService.completion(orderId, {
        rating: review.rate,
        comment: review.comment,
        completionCode: review.completionCode,
      });

      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to submit review", err);
      alert(
        err.response?.data?.message || "Error: Check your completion code.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div
        className="review-form-wrapper"
        style={{ textAlign: "center", padding: "30px 20px" }}
      >
        <CheckCircle2
          size={48}
          color="#10b981"
          style={{ margin: "0 auto 10px" }}
        />
        <h3 style={{ margin: "0 0 10px 0", color: "#111827" }}>
          Job Completed!
        </h3>
        <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
          Thank you for submitting your review.
        </p>
      </div>
    );
  }

  return (
    <div className="review-form-wrapper">
      <form onSubmit={handleSubmit}>
        {/* Rating Fieldset */}
        <div className="form-group">
          <label className="form-label">Rate your experience</label>
          <fieldset className="starability-slot">
            <legend>Rating:</legend>
            {/* Must map from 5 down to 1 for the old starability CSS sibling selectors to work */}
            {[1, 2, 3, 4, 5].map((num) => (
              <React.Fragment key={num}>
                <input
                  type="radio"
                  id={`rate${num}-${orderId}`}
                  name="rate"
                  value={num}
                  onChange={handleChange}
                  checked={review.rate === String(num)}
                />
                <label htmlFor={`rate${num}-${orderId}`}>{num} star</label>
              </React.Fragment>
            ))}
          </fieldset>
        </div>

        {/* Comment Textarea */}
        <div className="form-group">
          <label htmlFor="comment" className="form-label">
            Add a written review (optional)
          </label>
          <textarea
            name="comment"
            id="comment"
            className="form-textarea"
            placeholder="Tell us what you liked about the service..."
            onChange={handleChange}
            value={review.comment}
          ></textarea>
        </div>

        {/* Completion Code Input */}
        <div className="form-group">
          <label htmlFor="completionCode" className="form-label">
            Completion Code
          </label>
          <input
            type="text"
            id="completionCode"
            className="form-input code-input"
            placeholder="ENTER 8-DIGIT CODE"
            name="completionCode"
            onChange={handleChange}
            value={review.completionCode}
            required
            maxLength={8}
          />
          <span className="helper-text">
            Enter the code provided to your worker to mark this job as finished.
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-submit-review"
          disabled={isSubmitting || !review.rate || !review.completionCode}
        >
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              Submit & Complete Job <Send size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
