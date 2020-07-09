import React, {Component} from "react";
import { Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {getProfileFetch, logoutUser} from '../redux/actions/userActions';
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

const Simple = cssTransition({
  enter: 'enter',
  exit: 'exit',
});

class App extends Component {
  componentDidMount = () => {
    this.props.getProfileFetch()
  }

  render() {
    return (
      <div className="app">
        <Switch>
          { this.props.currentUser.currentUser &&
            <Route path="/legal-illegal"
              render={(props) => <Bandeoke {...props} track={legalIllegalTrack} scores={legalIllegalScores} title={'Legal Illegal - Peggy Seeger & Ewan MacColl'} songId={'legal-illegal'}/>}
            />
          }
          { this.props.currentUser.currentUser &&
          <Route path="/possession"
            render={(props) => <Bandeoke {...props} track={possessionTrack} scores={possessionScores} title={'Possesion - Les Baxter'} songId={'possession'}/>}
          />
          }
          { this.props.currentUser.currentUser &&
          <Route path="/i-need-you"
            render={(props) => <Bandeoke {...props} track={iNeedYouTrack} scores={iNeedYouScores} title={'I Need You - BTS'} songId={'i-need-you'}/>}
          />
          }
          { this.props.currentUser.currentUser &&
          <Route path="/eye-of-the-tiger"
            render={(props) => <Bandeoke {...props} track={eyeOfTheTigerTrack} scores={eyeOfTheTigerScores} title={'Eye Of The Tiger'} songId={'eye-of-the-tiger'}/>}
          />
          }
          { this.props.currentUser.currentUser &&
          <Route path="/mad-world"
            render={(props) => <Bandeoke {...props} track={madWorldTrack} scores={madWorldScores} title={'Mad World'} songId={'mad-world'}/>}
          />
          }
          { this.props.currentUser.currentUser &&
          <Route path="/pink-panther"
            render={(props) => <Bandeoke {...props} track={pinkPantherTrack} scores={pinkPantherScores} title={'Pink Panther'} songId={'pink-panther'}/>}
          />
          }
          { this.props.currentUser.currentUser &&
          <Route path="/happier"
            render={(props) => <Bandeoke {...props} track={happierTrack} scores={happierScores} title={'Happier'} songId={'happier'}/>}
          />
          }
          { this.props.currentUser.currentUser &&
          <Route path="/filter"
            render={(props) => <Bandeoke {...props} track={filterTrack} scores={filterScores} title={'Filter'} songId={'filter'}/>}
          />
          }
          { this.props.currentUser.currentUser &&
          <Route path="/gods-plan"
            render={(props) => <Bandeoke {...props} track={godsPlanTrack} scores={godsPlanScores} title={'God\'s Plan'} songId={'gods-plan'}/>}
          />
          }
          { this.props.currentUser.currentUser &&
          <Route path="/ode-to-joy"
            render={(props) => <Bandeoke {...props} track={odeToJoyTrack} scores={odeToJoyScores} title={'Ode To Joy'} songId={'ode-to-joy'}/>}
          />
          }
          <Route path="/how-to" component={HowToPage} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/" component={HomePage} />
          <Route component={PageNotFound} />
        </Switch>
        <ToastContainer transition={Simple} hideProgressBar />
      </div>
    );
  }
}

App.propTypes = {
  currentUser: PropTypes.object,
  getProfileFetch: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser
})

const mapDispatchToProps = dispatch => ({
  getProfileFetch: () => dispatch(getProfileFetch()),
  logoutUser: () => dispatch(logoutUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
