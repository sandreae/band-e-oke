// File holds overdub reducer
// Reducers specify how the application's state changes in response to actions sent to the store.
import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function overdubsAudioReducer(state = initialState.audio, action) {
  switch (action.type) {
    case types.PROCESSING_OVERDUBS:
    return Object.assign({}, state, {
      overdubsComplete: false,
      overdubsProcessing: true,
    })
    case types.PROCESSING_BACKINGTRACK:
    return Object.assign({}, state, {
      backingTrackProcessing: true,
      backingTrackComplete: false,
    })
    case types.PROCESSING_NEW_OVERDUB:
    return Object.assign({}, state, {
      newOverdubProcessing: true,
      newOverdubComplete: false,
    })
    case types.PROCESS_OVERDUBS_COMPLETE:
      return Object.assign({}, state, {
        overdubsComplete: true,
        overdubsProcessing: false,
      })
    case types.PROCESS_LOADED_OVERDUBS:
      return Object.assign({}, state, {
        overdubsComplete: false,
        overdubsProcessing: false,
      })
    case types.OVERDUBS_EMPTY:
      return Object.assign({}, state, {
        overdubsComplete: true,
        overdubsProcessing: false,
      })
    case types.PROCESS_BACKINGTRACK_COMPLETE:
    return Object.assign({}, state, {
      backingTrackComplete: true,
      backingTrackProcessing: false,
    })
    case types.PROCESS_NEW_OVERDUB_COMPLETE:
    return Object.assign({}, state, {
      newOverdubComplete: true,
      newOverdubProcessing: false,
    })
    case types.REFRESH_OVERDUB_PARAMS:
    return Object.assign({}, state, {
      refreshOverdubParams: action.result,
    })
    default:
      return state;
  }
}
