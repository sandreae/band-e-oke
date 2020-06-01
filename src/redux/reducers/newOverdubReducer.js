// File holds item reducer
// Reducers specify how the application's state changes in response to actions sent to the store.
import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function newOverdubReducer(state = initialState.newOverdub, action) {
  switch (action.type) {
    case types.SET_OVERDUB_BLOB:
      return Object.assign({}, state, {
        url: action.url
      })
    case types.NUDGE_NEW_OVERDUB:
      return Object.assign({}, state, {
        nudge: action.overdub.nudge,
      })
    case types.SET_NEW_OVERDUB_BUFFER:
      return Object.assign({}, state, {
        buffer: action.overdub.buffer,
      })
    case types.REMOVE_NEW_OVERDUB:
      return Object.assign({}, state, {
        buffer: null,
        url: null,
      })
    case types.GAIN_NEW_OVERDUB:
      return Object.assign({}, state, {
        gain: action.overdub.gain,
      })
    default:
      return state;
  }
}
