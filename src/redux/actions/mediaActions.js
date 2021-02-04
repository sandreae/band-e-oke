// File holds all of the item action creators
import * as types from "./actionTypes";

export function scoreStatus(scoreStatus) {
  return { type: types.SCORE_STATUS, scoreStatus };
}

export function streamStatus(streamStatus) {
  return { type: types.STREAM_STATUS, streamStatus };
}
