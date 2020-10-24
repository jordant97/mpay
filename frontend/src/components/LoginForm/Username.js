import React, { useState } from "react";
import styles from "./styles.module.css";

function Username({ onButtonClick }) {

  let [value, setValue] = useState('');

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

export default Username;
