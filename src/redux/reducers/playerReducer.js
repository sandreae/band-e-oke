// File holds overdub reducer
// Reducers specify how the application's state changes in response to actions sent to the store.
import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function playerReducer(state = initialState.player, action) {
  switch (action.type) {
    case types.ALL_MEDIA_PLAYING:
    return Object.assign({}, state, {
       playing: action.result
    })
    case types.RECORD_OVERDUB:
    return Object.assign({}, state, {
       recording: action.result
    })
    case types.SIDEBAR_ACTIVE:
    return Object.assign({}, state, {
       sidebarActive: action.result
    })
    default:
      return state;
  }
}
