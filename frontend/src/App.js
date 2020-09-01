import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import LoginForm from "./components/LoginForm";

function App() {
  let [id, setID] = useState("");
  let [amount, setAmount] = useState("50");
  let [bank, setBank] = useState("MBB");
  let [show, setShow] = useState(false);

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

    let result = await axios.post("http://localhost:8888/new", {
      bank,
      amount,
    });

    setID(result.data.id);
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
