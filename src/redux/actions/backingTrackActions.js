// File holds all of the overdub action creators
import * as types from "./actionTypes";

export function setBackingTrackBuffer(buffer) {
  return { type: types.SET_BACKINGTRACK_BUFFER, buffer };
}
