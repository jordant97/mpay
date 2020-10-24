import React, {useState} from "react";
import styles from "./styles.module.css";

function Tac({ onButtonClick, tacDate, tacPhoneNumber }) {

  let [value, setValue] = useState('');

  return (
    <>
      <div className={styles["instructions"]}>Enter the TAC</div>
      <input
        className={styles["form-control"]}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />
      <button
        className={`${styles["modal-btn"]} ${styles["form-control"]}`}
        onClick={() => onButtonClick(value)}
      >
        Next
      </button>
      <p className={styles["tac-details"]}>
        Your TAC Request is successful
        {" " + tacDate ?? ""}. Your TAC number will be sent to your registered
        mobile phone number
        {" " + tacPhoneNumber ?? ""}.
      </p>

      {/* {timeout - countdown <= 150 ? (
            <p>Did not receive TAC. Resend</p>
          ) : (
            <></>
          )} */}
    </>
  );
}

export default Tac;
