import React from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "./home/HomePage";
import PageNotFound from "./PageNotFound";
// eslint-disable-next-line import/no-named-as-default
import Bandeoke from "./bandeoke/Bandeoke";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <div className="container-fluid">
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/bandeoke" component={Bandeoke} />
        <Route component={PageNotFound} />
      </Switch>
      <ToastContainer autoClose={3000} hideProgressBar />
    </div>
  );
}

export default App;
