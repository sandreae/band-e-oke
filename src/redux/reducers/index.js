import { combineReducers } from "redux";
import apiCallsInProgress from "./apiStatusReducer";
import newOverdub from "./newOverdubReducer";
import overdubs from "./overdubReducer";
import audio from "./audioReducer";
import media from "./mediaReducer";
import users from "./userReducer";
import player from "./playerReducer";
import meta from "./metaReducer";
import { loadingBarReducer } from 'react-redux-loading-bar'

const rootReducer = combineReducers({
  loadingBar: loadingBarReducer,
  apiCallsInProgress: apiCallsInProgress,
  newOverdub: newOverdub,
  overdubs: overdubs,
  audio: audio,
  users: users,
  media: media,
  player: player,
  meta: meta,
});

export default rootReducer;
