import React from "react";
import { Route, Switch } from "react-router-dom";
import PageNotFound from "./PageNotFound";
// eslint-disable-next-line import/no-named-as-default
import Bandeoke from "./bandeoke/Bandeoke";
import HomePage from "./home/HomePage";
import { ToastContainer, cssTransition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import track from '../../public/legal.mp3'
import score from '../../public/legal-Eb.musicxml'

const Simple = cssTransition({
  enter: 'enter',
  exit: 'exit',
});

function App() {
  return (
    <div className="container-fluid">
      <Switch>
        <Route path="/bandeoke"
        render={(props) => <Bandeoke {...props} track={track} score={score} />}
         />
        <Route path="/" component={HomePage} />
        <Route component={PageNotFound} />
      </Switch>
      <ToastContainer transition={Simple} hideProgressBar />
    </div>
  );
}

export default App;
