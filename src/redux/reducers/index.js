import { combineReducers } from "redux";
import apiCallsInProgress from "./apiStatusReducer";
import newOverdub from "./newOverdubReducer";
import overdubs from "./overdubReducer";
import audio from "./audioReducer";
import sync from "./syncReducer";
import users from "./userReducer";
import player from "./playerReducer";
import { loadingBarReducer } from 'react-redux-loading-bar'

const rootReducer = combineReducers({
  loadingBar: loadingBarReducer,
  apiCallsInProgress: apiCallsInProgress,
  newOverdub: newOverdub,
  overdubs: overdubs,
  audio: audio,
  users: users,
  videoSync: sync,
  player: player,
});

export default rootReducer;
