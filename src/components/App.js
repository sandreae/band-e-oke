import React from "react";
import { Route, Switch } from "react-router-dom";
import PageNotFound from "./PageNotFound";
// eslint-disable-next-line import/no-named-as-default
import Bandeoke from "./bandeoke/Bandeoke";
import HomePage from "./home/HomePage";
import HowToPage from "./howto/HowToPage";
import { ToastContainer, cssTransition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import legalIllegalTrack from '../../public/legal-illegal.mp3'
import legalIllegalEb from '../../public/legal-illegal-Eb.musicxml'
import legalIllegalBb from '../../public/legal-illegal-Bb.musicxml'
import legalIllegalC from '../../public/legal-illegal-C.musicxml'
import iNeedYouTrack from '../../public/I_NEED_U.mp3'
import iNeedYouEb from '../../public/I_NEED_U-Eb.musicxml'
import iNeedYouBb from '../../public/I_NEED_U-Bb.musicxml'
import iNeedYouC from '../../public/I_NEED_U-C.musicxml'
import eyeOfTheTigerTrack from '../../public/eye-of-the-tiger.mp3'
import eyeOfTheTigerEb from '../../public/eye-of-the-tiger-Eb.musicxml'
import eyeOfTheTigerBb from '../../public/eye-of-the-tiger-Bb.musicxml'
import eyeOfTheTigerC from '../../public/eye-of-the-tiger-C.musicxml'
import possessionTrack from '../../public/Possession-full.mp3'
import possessionC from '../../public/Possession-minus-tempo-Flute.musicxml'

const legalIllegalScores = [{
    score: legalIllegalEb,
    name: 'Eb',
  }, {
    score: legalIllegalBb,
    name: 'Bb',
  }, {
    score: legalIllegalC,
    name: 'C',
}]

const iNeedYouScores = [{
    score: iNeedYouEb,
    name: 'Eb',
  }, {
    score: iNeedYouBb,
    name: 'Bb',
  }, {
    score: iNeedYouC,
    name: 'C',
}]

const eyeOfTheTigerScores = [{
    score: eyeOfTheTigerEb,
    name: 'Eb',
  }, {
    score: eyeOfTheTigerBb,
    name: 'Bb',
  }, {
    score: eyeOfTheTigerC,
    name: 'C',
}]

const possessionScores = [{
    score: possessionC,
    name: 'C'
}]

const Simple = cssTransition({
  enter: 'enter',
  exit: 'exit',
});

function App() {
  return (
    <div className="container-fluid">
      <Switch>
        <Route path="/legal-illegal"
          render={(props) => <Bandeoke {...props} track={legalIllegalTrack} scores={legalIllegalScores} title={'Legal Illegal - Peggy Seeger & Ewan MacColl'} songId={'legal-illegal'}/>}
        />
        <Route path="/possession"
          render={(props) => <Bandeoke {...props} track={possessionTrack} scores={possessionScores} title={'Possesion - Les Baxter'} songId={'possession'}/>}
        />
        <Route path="/i-need-you"
          render={(props) => <Bandeoke {...props} track={iNeedYouTrack} scores={iNeedYouScores} title={'I Need You - BTS'} songId={'i-need-you'}/>}
        />
        <Route path="/eye-of-the-tiger"
          render={(props) => <Bandeoke {...props} track={eyeOfTheTigerTrack} scores={eyeOfTheTigerScores} title={'Eye Of The Tiger'} songId={'eye-of-the-tiger'}/>}
        />
        <Route path="/how-to" component={HowToPage} />
        <Route path="/" component={HomePage} />
        <Route component={PageNotFound} />
      </Switch>
      <ToastContainer transition={Simple} hideProgressBar />
    </div>
  );
}

export default App;
