import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import LoginForm from "./components/LoginForm";
import firebase from "firebase/app";
import "firebase/firestore";

import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";

var config = {
  apiKey: "AIzaSyAuKticHpQ_M3K0C9ILY5_bsY4ynBKLOSo",
  authDomain: "mpay-9ce31.firebaseapp.com",
  databaseURL: "https://mpay-9ce31.firebaseio.com",
  projectId: "mpay-9ce31",
  storageBucket: "mpay-9ce31.appspot.com",
  messagingSenderId: "311234895167",
  appId: "1:311234895167:web:a79f496a8500b14715078a",
  measurementId: "G-Q21ZY838GH",
};
// Initialize Firebase
firebase.initializeApp(config);

const firestore = firebase.firestore();

function App() {
  let [id, setID] = useState("");
  let [amount, setAmount] = useState("50");
  let [bank, setBank] = useState("MBB");
  let [show, setShow] = useState(false);

  const transactionsRef = firestore
    .collection("transactions")
    .doc("Wk9VB4H10AsSsebF63pb");

  const [value, loading, error] = useDocumentData(transactionsRef);

  console.log(value);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleBankChange = (bank) => {
    setBank(bank);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !bank) {
      alert("Please select required field");
    }

    // let result = await axios.post("http://localhost:8888/new", {
    //   bank,
    //   amount,
    // });

    // console.log(result);

    // setID(result.data.id);
    setShow(true);
  };

  const selectedClass = (_bank) => {
    if (_bank === bank) {
      return "selected";
    } else {
      return "";
    }
  };

  const resetState = async () => {
    try {
      console.log(id);
      await axios.post("http://localhost:8888/close", {
        id,
      });

      setBank("MBB");
      setAmount("50");
      setID("");
      setShow(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="App">
      <h1>MPay</h1>
      <form onSubmit={handleSubmit}>
        <div className="banks-option">
          <button
            className={`bank-option-button ${selectedClass("MBB")}`}
            type="button"
            onClick={() => handleBankChange("MBB")}
          >
            MAYBANK
          </button>
          <button
            className={`bank-option-button ${selectedClass("BSN")}`}
            type="button"
            onClick={() => handleBankChange("BSN")}
          >
            BSN
          </button>
          <button
            className={`bank-option-button ${selectedClass("HLB")}`}
            type="button"
            onClick={() => handleBankChange("HLB")}
          >
            HONG LEONG
          </button>
          <button
            className={`bank-option-button ${selectedClass("PBE")}`}
            type="button"
            onClick={() => handleBankChange("PBE")}
          >
            PUBLIC BANK
          </button>
          <button
            className={`bank-option-button ${selectedClass("CIMB")}`}
            type="button"
            onClick={() => handleBankChange("CIMB")}
          >
            CIMB BANK
          </button>
          <button
            className={`bank-option-button ${selectedClass("RHB")}`}
            type="button"
            onClick={() => handleBankChange("RHB")}
          >
            RHB BANK
          </button>
        </div>
        <label>
          Amount
          <input
            type="text"
            placeholder="Min/Max Limit: 50/500000"
            value={amount}
            onChange={handleAmountChange}
            className="amount-input"
          />
        </label>
        <button className="submit-btn" type="submit">
          Submit
        </button>

        <button className="submit-btn" type="button" onClick={resetState}>
          Reset
        </button>
      </form>
      {show ? <LoginForm id={id} bank={bank} amount={amount} /> : <></>}
      {/* {show ? (
        <iframe
          className="payment-modal"
          src="https://ecvi-eva.web.app/"
          title="iFrame Testing"
        ></iframe>
      ) : (
        <></>
      )} */}
    </div>
  );
}

export default App;
