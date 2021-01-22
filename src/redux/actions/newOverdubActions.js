// File holds all of the item action creators
import * as types from "./actionTypes";

export function setOverdubBlob(url, buffer) {
  return { type: types.SET_OVERDUB_BLOB, url, buffer};
}

export function nudgeNewOverdub(overdub) {
  return { type: types.NUDGE_NEW_OVERDUB, overdub };
}

export function setOverdubBuffer(overdub) {
  return { type: types.SET_NEW_OVERDUB_BUFFER, overdub };
}

export function removeNewOverdub(url) {
  window.URL.revokeObjectURL(url)
  return { type: types.REMOVE_NEW_OVERDUB };
}

export function gainNewOverdub(overdub) {
  return { type: types.GAIN_NEW_OVERDUB, overdub };
}
