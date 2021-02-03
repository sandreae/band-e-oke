import React, {Component} from "react";
import { Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {logoutUser, loginUser, fetchingUser} from '../redux/actions/userActions';
import * as userApi from "../api/userApi";
import PageNotFound from "./PageNotFound";
import Bandeoke from "./bandeoke/Bandeoke";
import HomePage from "./home/HomePage";
import HowToPage from "./howto/HowToPage";
import Signup from "./users/Signup";
import Login from "./users/Login";
import { ToastContainer, cssTransition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import legalIllegalTrack from '../../public/legal-illegal.mp3'
import legalIllegalEb from '../../public/legal-illegal-Eb.musicxml'
import legalIllegalBb from '../../public/legal-illegal-Bb.musicxml'
import legalIllegalC from '../../public/legal-illegal-C.musicxml'
import iNeedYouTrack from '../../public/scores/i-need-you/i-need-you.mp3'
import iNeedYouEb from '../../public/scores/i-need-you/i-need-you-Eb.musicxml'
import iNeedYouBb from '../../public/scores/i-need-you/i-need-you-Bb.musicxml'
import iNeedYouC from '../../public/scores/i-need-you/i-need-you-C.musicxml'
import iNeedYouEbPdf from '../../public/scores/i-need-you/i-need-you-Eb.pdf'
import iNeedYouBbPdf from '../../public/scores/i-need-you/i-need-you-Bb.pdf'
import iNeedYouCPdf from '../../public/scores/i-need-you/i-need-you-C.pdf'
import eyeOfTheTigerTrack from '../../public/scores/eye-of-the-tiger/eye-of-the-tiger.mp3'
import eyeOfTheTigerEb from '../../public/scores/eye-of-the-tiger/eye-of-the-tiger-Eb.musicxml'
import eyeOfTheTigerBb from '../../public/scores/eye-of-the-tiger/eye-of-the-tiger-Bb.musicxml'
import eyeOfTheTigerC from '../../public/scores/eye-of-the-tiger/eye-of-the-tiger-C.musicxml'
import eyeOfTheTigerEbPdf from '../../public/scores/eye-of-the-tiger/eye-of-the-tiger-Eb.pdf'
import eyeOfTheTigerBbPdf from '../../public/scores/eye-of-the-tiger/eye-of-the-tiger-Bb.pdf'
import eyeOfTheTigerCPdf from '../../public/scores/eye-of-the-tiger/eye-of-the-tiger-C.pdf'
import madWorldTrack from '../../public/scores/mad-world/mad-world.mp3'
import madWorldEb from '../../public/scores/mad-world/mad-world-Eb.musicxml'
import madWorldBb from '../../public/scores/mad-world/mad-world-Bb.musicxml'
import madWorldC from '../../public/scores/mad-world/mad-world-C.musicxml'
import madWorldEbPdf from '../../public/scores/mad-world/mad-world-Eb.pdf'
import madWorldBbPdf from '../../public/scores/mad-world/mad-world-Bb.pdf'
import madWorldCPdf from '../../public/scores/mad-world/mad-world-C.pdf'
import pinkPantherTrack from '../../public/scores/pink-panther/pink-panther.mp3'
import pinkPantherEb from '../../public/scores/pink-panther/pink-panther-Eb.musicxml'
import pinkPantherBb from '../../public/scores/pink-panther/pink-panther-Bb.musicxml'
import pinkPantherC from '../../public/scores/pink-panther/pink-panther-C.musicxml'
import pinkPantherEbPdf from '../../public/scores/pink-panther/pink-panther-Eb.pdf'
import pinkPantherBbPdf from '../../public/scores/pink-panther/pink-panther-Bb.pdf'
import pinkPantherCPdf from '../../public/scores/pink-panther/pink-panther-C.pdf'
import godsPlanTrack from '../../public/scores/gods-plan/gods-plan.mp3'
import godsPlanEb from '../../public/scores/gods-plan/gods-plan-Eb.musicxml'
import godsPlanBb from '../../public/scores/gods-plan/gods-plan-Bb.musicxml'
import godsPlanC from '../../public/scores/gods-plan/gods-plan-C.musicxml'
import godsPlanEbPdf from '../../public/scores/gods-plan/gods-plan-Eb.pdf'
import godsPlanBbPdf from '../../public/scores/gods-plan/gods-plan-Bb.pdf'
import godsPlanCPdf from '../../public/scores/gods-plan/gods-plan-C.pdf'
import odeToJoyTrack from '../../public/scores/ode-to-joy/ode-to-joy.mp3'
import odeToJoyEb from '../../public/scores/ode-to-joy/ode-to-joy-Eb.musicxml'
import odeToJoyBb from '../../public/scores/ode-to-joy/ode-to-joy-Bb.musicxml'
import odeToJoyC from '../../public/scores/ode-to-joy/ode-to-joy-C.musicxml'
import odeToJoyEbPdf from '../../public/scores/ode-to-joy/ode-to-joy-Eb.pdf'
import odeToJoyBbPdf from '../../public/scores/ode-to-joy/ode-to-joy-Bb.pdf'
import odeToJoyCPdf from '../../public/scores/ode-to-joy/ode-to-joy-C.pdf'
import happierTrack from '../../public/scores/happier/happier.mp3'
import happierEb from '../../public/scores/happier/happier-Eb.musicxml'
import happierBb from '../../public/scores/happier/happier-Bb.musicxml'
import happierC from '../../public/scores/happier/happier-C.musicxml'
import happierEbPdf from '../../public/scores/happier/happier-Eb.pdf'
import happierBbPdf from '../../public/scores/happier/happier-Bb.pdf'
import happierCPdf from '../../public/scores/happier/happier-C.pdf'
import filterTrack from '../../public/scores/filter/filter.mp3'
import filterEb from '../../public/scores/filter/filter-Eb.musicxml'
import filterBb from '../../public/scores/filter/filter-Bb.musicxml'
import filterC from '../../public/scores/filter/filter-C.musicxml'
import filterEbPdf from '../../public/scores/filter/filter-Eb.pdf'
import filterBbPdf from '../../public/scores/filter/filter-Bb.pdf'
import filterCPdf from '../../public/scores/filter/filter-C.pdf'
import possessionTrack from '../../public/scores/possession/possession.mp3'
import possessionC from '../../public/scores/possession/possession-C.musicxml'
import possessionCPdf from '../../public/scores/possession/possession-C.pdf'
import memeThemes1Track from '../../public/scores/meme-themes-1/meme-themes-1.mp3'
import memeThemes1Score from '../../public/scores/meme-themes-1/meme-themes-1-score.musicxml'
import memeThemes1ScorePdf from '../../public/scores/meme-themes-1/meme-themes-1-score.pdf'
import thereWillNeverEbPdf from '../../public/scores/there-will-never/there-will-never-be-another-you-Eb.pdf'
import thereWillNeverBbPdf from '../../public/scores/there-will-never/there-will-never-be-another-you-Bb.pdf'
import thereWillNeverCPdf from '../../public/scores/there-will-never/there-will-never-be-another-you-C.pdf'
import iWishIKnewScorePdf from '../../public/scores/i-wish-i-knew/i-wish-i-knew-score.pdf'
import bagsAndTraneEbPdf from '../../public/scores/bags-and-trane/bags-and-trane-Eb.pdf'
import bagsAndTraneCPdf from '../../public/scores/bags-and-trane/bags-and-trane-C.pdf'
import offTheWallEbPdf from '../../public/scores/off-the-wall/off-the-wall-Eb.pdf'
import offTheWallCPdf from '../../public/scores/off-the-wall/off-the-wall-C.pdf'
import offTheWallBbPdf from '../../public/scores/off-the-wall/off-the-wall-Bb.pdf'
import offTheWallMixedPdf from '../../public/scores/off-the-wall/off-the-wall-mixed.pdf'

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
    pdf: iNeedYouEbPdf,
    name: 'Eb',
  }, {
    score: iNeedYouBb,
    pdf: iNeedYouBbPdf,
    name: 'Bb',
  }, {
    score: iNeedYouC,
    pdf: iNeedYouCPdf,
    name: 'C',
}]

const eyeOfTheTigerScores = [{
    score: eyeOfTheTigerEb,
    pdf: eyeOfTheTigerEbPdf,
    name: 'Eb',
  }, {
    score: eyeOfTheTigerBb,
    pdf: eyeOfTheTigerBbPdf,
    name: 'Bb',
  }, {
    score: eyeOfTheTigerC,
    pdf: eyeOfTheTigerCPdf,
    name: 'C',
}]

const madWorldScores = [{
    score: madWorldEb,
    pdf: madWorldEbPdf,
    name: 'Eb',
  }, {
    score: madWorldBb,
    pdf: madWorldBbPdf,
    name: 'Bb',
  }, {
    score: madWorldC,
    pdf: madWorldCPdf,
    name: 'C',
}]

const pinkPantherScores = [{
    score: pinkPantherEb,
    pdf: pinkPantherEbPdf,
    name: 'Eb',
  }, {
    score: pinkPantherBb,
    pdf: pinkPantherBbPdf,
    name: 'Bb',
  }, {
    score: pinkPantherC,
    pdf: pinkPantherCPdf,
    name: 'C',
}]

const happierScores = [{
    score: happierEb,
    pdf: happierEbPdf,
    name: 'Eb',
  }, {
    score: happierBb,
    pdf: happierBbPdf,
    name: 'Bb',
  }, {
    score: happierC,
    pdf: happierCPdf,
    name: 'C',
}]

const filterScores = [{
    score: filterEb,
    pdf: filterEbPdf,
    name: 'Eb',
  }, {
    score: filterBb,
    pdf: filterBbPdf,
    name: 'Bb',
  }, {
    score: filterC,
    pdf: filterCPdf,
    name: 'C',
}]

const godsPlanScores = [{
    score: godsPlanEb,
    pdf: godsPlanEbPdf,
    name: 'Eb',
  }, {
    score: godsPlanBb,
    pdf: godsPlanBbPdf,
    name: 'Bb',
  }, {
    score: godsPlanC,
    pdf: godsPlanCPdf,
    name: 'C',
}]

const odeToJoyScores = [{
    score: odeToJoyEb,
    pdf: odeToJoyEbPdf,
    name: 'Eb',
  }, {
    score: odeToJoyBb,
    pdf: odeToJoyBbPdf,
    name: 'Bb',
  }, {
    score: odeToJoyC,
    pdf: odeToJoyCPdf,
    name: 'C',
}]

const possessionScores = [{
    score: possessionC,
    pdf: possessionCPdf,
    name: 'C'
}]

const memeThemes1Scores = [{
    score: memeThemes1Score,
    pdf: memeThemes1ScorePdf,
    name: 'Score'
}]

const thereWillNeverScores = [{
    score: null,
    pdf: thereWillNeverEbPdf,
    name: 'Eb'
  }, {
    score: null,
    pdf: thereWillNeverBbPdf,
    name: 'Bb'
  }, {
    score: null,
    pdf: thereWillNeverCPdf,
    name: 'C'
}]

const iWishIKnewScores = [{
    score: null,
    pdf: iWishIKnewScorePdf,
    name: 'Score'
  }]

const bagsAndTraneScores = [{
    score: null,
    pdf: bagsAndTraneCPdf,
    name: 'C'
  },{
    score: null,
    pdf: bagsAndTraneEbPdf,
    name: 'Eb'
  }]

  const offTheWallScores = [{
    score: null,
    pdf: offTheWallEbPdf,
    name: 'Eb'
  }, {
    score: null,
    pdf: offTheWallBbPdf,
    name: 'Bb'
  }, {
    score: null,
    pdf: offTheWallCPdf,
    name: 'C'
  },{
  score: null,
  pdf: offTheWallMixedPdf,
  name: 'mixed'
}]

const Simple = cssTransition({
  enter: 'enter',
  exit: 'exit',
});

let scores = [{title: "Meme Themes 1", scores: memeThemes1Scores, track: memeThemes1Track, songId:"meme-themes-1", path:"/meme-themes-1"},
              {title: "I Need You", scores: iNeedYouScores, track: iNeedYouTrack, songId:"i-need-you", path:"/i-need-you"},
              {title: "Eye Of The Tiger", scores: eyeOfTheTigerScores, track: eyeOfTheTigerTrack, songId:"eye-of-the-tiger", path:"/eye-of-the-tiger"},
              {title: "Mad World", scores: madWorldScores, track: madWorldTrack, songId:"mad-world", path:"/mad-world"},
              {title: "Happier", scores: happierScores, track: happierTrack, songId:"happier", path:"/happier"},
              {title: "Pink Panther", scores: pinkPantherScores, track: pinkPantherTrack, songId:"pink-panther", path:"/pink-panther"},
              {title: "Filter", scores: filterScores, track: filterTrack, songId:"filter", path:"/filter"},
              {title: "God's Plan", scores: godsPlanScores, track: godsPlanTrack, songId:"gods-plan", path:"/gods-plan"},
              {title: "Ode To Joy", scores: odeToJoyScores, track: odeToJoyTrack, songId:"ode-to-joy", path:"/ode-to-joy"},
              {title: "Possession", scores: possessionScores, track: possessionTrack, songId:"possession", path:"/possession"},
              {title: "There Will Never Be Another You", scores: thereWillNeverScores, track: null, songId:"there-will-never-be-another-you", path:"/there-will-never-be-another-you"},
              {title: "I Wish I Knew How It Would Feel To Be Free ", scores: iWishIKnewScores, track: null, songId:"i-wish-i-knew", path:"/i-wish-i-knew"},
              {title: "Bags And Trane ", scores: bagsAndTraneScores, track: null, songId:"bags-and-trane", path:"/bags-and-trane"},
              {title: "Off The Wall ", scores: offTheWallScores, track: null, songId:"off-the-wall", path:"off-the-wall"},
            ]

class App extends Component {

  componentDidMount(){
    if (localStorage.token) {
      userApi.getProfileFetch(localStorage.token).then((data)=>{
        this.props.loginUser(data.username)
        this.props.fetchingUser(false)
      })} else {
        this.props.fetchingUser(false)
      }
  }

  render() {
    console.log(this.props)
    return (
      <div className="app">
        <Switch>
        {scores.map((score, i) => {
          if (this.props.currentUser.username){
          return <Route key={i} path={"/scores" + score.path}
            render={(props) =>
              <Bandeoke {...props}
                track={score.track}
                scores={score.scores}
                title={score.title}
                songId={score.songId}/>}
            />
         } else {
           return <Route path="/login" component={Login} />
         }})}
          <Route path="/how-to" component={HowToPage} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/" render={()=><HomePage songs={scores}/>} />
          <Route component={PageNotFound} />
        </Switch>
        <ToastContainer transition={Simple} hideProgressBar />
      </div>
    );
  }
}

App.propTypes = {
  currentUser: PropTypes.object,
  logoutUser: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  fetchingUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
})

const mapDispatchToProps = (dispatch) => {
  return {
    logoutUser: () => dispatch(logoutUser()),
    loginUser: (username) => dispatch(loginUser(username)),
    fetchingUser: (bool) => dispatch(fetchingUser(bool))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
