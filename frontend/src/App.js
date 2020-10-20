import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import LoginForm from "./components/LoginForm";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/transaction/:transactionId">
          <LoginForm id="123132" bank="MBB" amount="50" />
        </Route>
        <Route>
          <h1>Not found</h1>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
