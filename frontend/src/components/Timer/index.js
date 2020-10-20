import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

function Timer({ timeout, start }) {
  let [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer = setInterval(() => {
      let now = Date.now();
      let _countdown = Math.round((now - start) / 1000);

      if (timeout - _countdown >= 0) {
        setCountdown(_countdown);

        if (timeout - _countdown === 0) {
          clearTimeout(timer);
        }
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
