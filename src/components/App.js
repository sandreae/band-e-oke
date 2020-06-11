import React from "react";
import { Route, Switch } from "react-router-dom";
import PageNotFound from "./PageNotFound";
// eslint-disable-next-line import/no-named-as-default
import Bandeoke from "./bandeoke/Bandeoke";
import HomePage from "./home/HomePage";
import { ToastContainer, cssTransition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import legalIllegalTrack from '../../public/legal.mp3'
import legalIllegalScore from '../../public/legal-Eb.musicxml'
import possessionTrack from '../../public/Possession-full.mp3'
import possessionScore from '../../public/Possession-minus-tempo-Flute.musicxml'

const Simple = cssTransition({
  enter: 'enter',
  exit: 'exit',
});

function App() {
  return (
    <div className="container-fluid">
      <Switch>
        <Route path="/legal-illegal"
          render={(props) => <Bandeoke {...props} track={legalIllegalTrack} score={legalIllegalScore} title={'legal-illegal'}/>}
        />
        <Route path="/possession"
          render={(props) => <Bandeoke {...props} track={possessionTrack} score={possessionScore} title={'possession'}/>}
        />
        <Route path="/" component={HomePage} />
        <Route component={PageNotFound} />
      </Switch>
      <ToastContainer transition={Simple} hideProgressBar />
    </div>
  );
}

export default App;
