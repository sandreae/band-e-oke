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
import "./App.css";

const baseUrl = process.env.BASE_URL
const scoresBaseUrl = baseUrl + 'downloads/scores/'

// files must be labelled correctly and placed in named folders public/scores/score-name/score-name-C.pdf

const generate_score_paths = (name, parts) => {
  const scoreObject = parts.map((part) => {
    return {
      pdf: `${scoresBaseUrl}${name}/${name}-${part}.pdf`,
      name: part
    }
  })
  return Array.from(scoreObject)
}

const generateScoreProps = (title, filename, parts, isTrack=true) => {
  let track = null
  if (isTrack){
    track = `${scoresBaseUrl}${filename}/${filename}.mp3`
  }
  return {
    title: title,
    scores: generate_score_paths(filename, parts),
    track: track,
    songId: filename,
    path: "/" + filename
  }
}

let scores = [
              generateScoreProps('Meme Themes 1', 'meme-themes-1', ['score']),
              generateScoreProps('I Need You', 'i-need-you', ['Eb', 'Bb', 'C']),
              generateScoreProps('Eye Of The Tiger', 'eye-of-the-tiger', ['Eb', 'Bb', 'C']),
              generateScoreProps('Mad World', 'mad-world', ['Eb', 'Bb', 'C']),
              generateScoreProps('Happier', 'happier', ['Eb', 'Bb', 'C']),
              generateScoreProps('Pink Panther', 'pink-panther', ['Eb', 'Bb', 'C']),
              generateScoreProps('Filter', 'filter', ['Eb', 'Bb', 'C']),
              generateScoreProps("God's Plan", 'gods-plan', ['Eb', 'Bb', 'C']),
              generateScoreProps('Ode To Joy', 'ode-to-joy', ['Eb', 'Bb', 'C']),
              generateScoreProps('Possession', 'possession', ['C']),
              generateScoreProps('There Will Never Be Another You', 'there-will-never-be-another-you', ['Eb', 'Bb', 'C'], false),
              generateScoreProps('I Wish I Knew How It Would Feel To Be Free', 'i-wish-i-knew', ['score'], false),
              generateScoreProps('Bags And Trane', 'bags-and-trane', ['Eb', 'Bb', 'C'], false),
              generateScoreProps('Off The Wall', 'off-the-wall', ['Eb', 'Bb', 'C', 'mixed'], false),
              generateScoreProps('Song For Che', 'song-for-che', ['Eb', 'Bb', 'C']),
              generateScoreProps('Legal Illegal', 'legal-illegal', ['Eb', 'Bb', 'C'], false),
              generateScoreProps('Nine To Five', 'nine-to-five', ['Eb', 'Bb', 'C']),
              generateScoreProps('St Thomas', 'st-thomas', ['Bb'], false),
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
