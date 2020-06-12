import React from "react";
import { Route, Switch } from "react-router-dom";
import PageNotFound from "./PageNotFound";
// eslint-disable-next-line import/no-named-as-default
import Bandeoke from "./bandeoke/Bandeoke";
import HomePage from "./home/HomePage";
import { ToastContainer, cssTransition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import legalIllegalTrack from '../../public/legal-illegal.mp3'
import legalIllegalEb from '../../public/legal-illegal-Eb.musicxml'
import legalIllegalBb from '../../public/legal-illegal-Bb.musicxml'
import legalIllegalC from '../../public/legal-illegal-C.musicxml'
import possessionTrack from '../../public/Possession-full.mp3'
import possessionScore from '../../public/Possession-minus-tempo-Flute.musicxml'

const legalIllegalScores = {Eb: legalIllegalEb, Bb: legalIllegalBb, C: legalIllegalC}
console.log(legalIllegalScores)

const Simple = cssTransition({
  enter: 'enter',
  exit: 'exit',
});

function App() {
  return (
    <div className="container-fluid">
      <Switch>
        <Route path="/legal-illegal"
          render={(props) => <Bandeoke {...props} track={legalIllegalTrack} scores={legalIllegalScores} title={'legal-illegal'}/>}
        />
        <Route path="/" component={HomePage} />
        <Route component={PageNotFound} />
      </Switch>
      <ToastContainer transition={Simple} hideProgressBar />
    </div>
  );
}

export default App;
