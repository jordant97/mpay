import React from "react";
function SomethingWentWrong({ onReturn }) {
  return (
    <>
      <h3>Transaction Failed</h3>
      <br />
      <p>
        Transaction Failed. It seems like something has gone wrong. Please
        initiate a new payment or contact Merchant for support.
      </p>
      <br />
      <a href="/#" onClick={onReturn}>
        Returning to Merchant
      </a>
    </>
  );
}

export default SomethingWentWrong;
