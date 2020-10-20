import React from "react";
import styles from "./styles.module.css";

function Password({ value, onValueChange, onButtonClick }) {
  return (
    <>
      <div className={styles["instructions"]}>Please Enter Your Password</div>
      <input
        className={styles["form-control"]}
        type="password"
        value={value}
        placeholder="Bank Password"
        onChange={onValueChange}
        required
      />
      <button
        className={`${styles["modal-btn"]} ${styles["form-control"]}`}
        onClick={onButtonClick}
      >
        Next
      </button>
    </>
  );
}

export default Password;
