// File holds all of the item action creators
import * as types from "./actionTypes";

export function setVideoSync(syncerEl) {
  return { type: types.SET_VIDEO_SYNC, syncerEl };
}

export function addVideoSyncChildren(children) {
  return { type: types.ADD_SYNC_CHILDREN, children };
}

export function offsetScore(scoreOffset) {
  return { type: types.OFFSET_SCORE, scoreOffset };
}
