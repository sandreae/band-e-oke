import { combineReducers } from "redux";
import apiCallsInProgress from "./apiStatusReducer";
import newOverdub from "./newOverdubReducer";
import overdubs from "./overdubReducer";
import backingTrack from "./backingTrackReducer";
import audio from "./audioReducer";
import media from "./mediaReducer";
import currentUser from "./userReducer";
import player from "./playerReducer";
import meta from "./metaReducer";
import { loadingBarReducer } from 'react-redux-loading-bar'

const rootReducer = combineReducers({
  loadingBar: loadingBarReducer,
  apiCallsInProgress: apiCallsInProgress,
  newOverdub: newOverdub,
  overdubs: overdubs,
  backingTrack: backingTrack,
  audio: audio,
  currentUser: currentUser,
  media: media,
  player: player,
  meta: meta,
});

export default rootReducer;
