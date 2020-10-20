import React from "react";

function TimeoutError({ onReturn }) {
  return (
    <>
      <h3>Timeout Error</h3>
      <br />
      <p>
        Failed to complete the transaction within the time limit. Please try
        again.
      </p>
      <br />
      <a href="/#" onClick={onReturn}>
        Returning to Merchant
      </a>
    </>
  );
}

export default TimeoutError;
