import React from "react";
import FirebaseContext from "./context";
import config from "./config";
import firebase from "firebase/app";
import "firebase/firestore";

class Firebase {
  constructor() {
    firebase.initializeApp(config);

    this.firestore = firebase.firestore();
  }

  getTransactionRef = (transactionId) => {
    return this.firestore
    .collection("transactions")
    .doc(transactionId);
  }
}

export default Firebase;
export { FirebaseContext };
