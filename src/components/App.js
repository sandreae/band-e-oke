import React from "react";
import { Route, Switch } from "react-router-dom";
import PageNotFound from "./PageNotFound";
// eslint-disable-next-line import/no-named-as-default
import Bandeoke from "./bandeoke/Bandeoke";
import { ToastContainer, cssTransition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const Simple = cssTransition({
  enter: 'enter',
  exit: 'exit',
});

function App() {
  return (
    <div className="container-fluid">
      <Switch>
        <Route path="/" component={Bandeoke} />
        <Route component={PageNotFound} />
      </Switch>
      <ToastContainer transition={Simple} hideProgressBar />
    </div>
  );
}

export default App;
