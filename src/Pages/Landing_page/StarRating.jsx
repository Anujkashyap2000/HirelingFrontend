export const StarRating = ({ rating }) => {
  // Convert the rating to a number
  const numericRating = Number(rating) || 0;
  
  // Round to the nearest whole number for the stars
  const roundedRating = Math.round(numericRating);

  return (
    <span className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span 
          key={star} 
          style={{ color: star <= roundedRating ? "#ffc107" : "#e4e5e9", fontSize: "2rem" }}
        >
          ★
        </span>
      ))}
      <span style={{ marginLeft: "0.1px", color: "#666", fontSize: "0.9rem" }}>
        ({numericRating.toFixed(1)})
      </span>
    </span>
  );
};