// File holds item reducer
// Reducers specify how the application's state changes in response to actions sent to the store.
import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function backingTrackReducer(state = initialState.backingTrack, action) {
  switch (action.type) {
    case types.SET_BACKINGTRACK_BUFFER:
      return Object.assign({}, state, {
        buffer: action.buffer
      })
    default:
      return state;
  }
}
