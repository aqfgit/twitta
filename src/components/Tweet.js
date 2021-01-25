import React from "react";

const Tweet = ({ id, by, body }) => {
  return (
    <div key={id} style={{ border: "2px solid blue", padding: "10px" }}>
      <strong>{by}</strong> said:
      <p>{body}</p>
    </div>
  );
};

export default Tweet;
