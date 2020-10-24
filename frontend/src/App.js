import React, { useState } from "react";
import "./App.css";
import LoginForm from "./components/LoginForm";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/transaction/:transactionId">
          <LoginForm />
        </Route>
        <Route>
          <div></div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
