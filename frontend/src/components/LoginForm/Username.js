import React from "react";
import styles from "./styles.module.css";

function Username({ value, onValueChange, onButtonClick }) {
  return (
    <>
      <div className={styles["instructions"]}>
        Please Enter Your Online Banking Username
      </div>
      <input
        className={styles["form-control"]}
        type="text"
        value={value}
        placeholder="Bank Username"
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

export default Username;
