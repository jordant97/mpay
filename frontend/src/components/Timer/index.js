import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

function Timer({ timeout, start, onTimerEnd }) {
  let [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer = setInterval(() => {
      if (start) {
        if (countdown <= timeout) {
          setCountdown(Math.round((Date.now() - start) / 1000));
        }
      } else {
        onTimerEnd();
        clearTimeout(timer);
        console.log("Timer end");
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [start]);

  function formatCountdown(time) {
    if (time > 0) {
      let minutes = Math.floor(time / 60);
      let seconds = time % 60;

      return `0${minutes}:${("0" + seconds).slice(-2)}`;
    } else {
      return "EXPIRED";
    }
  }

  return (
    <p className={styles["stat-label"]}>
      Session Timeout: {formatCountdown(timeout - countdown)}
    </p>
  );
}

export default Timer;
