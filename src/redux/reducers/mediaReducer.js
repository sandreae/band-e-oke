// File holds item reducer
// Reducers specify how the application's state changes in response to actions sent to the store.
import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function mediaReducer(state = initialState.media, action) {
  switch (action.type) {
    case types.OFFSET_SCORE:
      return Object.assign({}, state, {
         scoreOffset: action.scoreOffset
      })
    case types.SCORE_STATUS:
      return Object.assign({}, state, {
         scoreStatus: action.scoreStatus
      })
    case types.STREAM_STATUS:
      return Object.assign({}, state, {
         streamStatus: action.streamStatus
      })
    default:
      return state;
  }
}
