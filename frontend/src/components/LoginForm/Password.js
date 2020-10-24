import React, {useState} from "react";
import styles from "./styles.module.css";

function Password({ onButtonClick }) {
  let [value, setValue] = useState('');
  return (
    <>
      <div className={styles["instructions"]}>Please Enter Your Password</div>
      <input
        className={styles["form-control"]}
        type="password"
        value={value}
        placeholder="Bank Password"
        onChange={(e) => setValue(e.target.value)}
        required
      />
      <button
        className={`${styles["modal-btn"]} ${styles["form-control"]}`}
        onClick={() => onButtonClick(value)}
      >
        Next
      </button>
    </>
  );
}

export default Password;
