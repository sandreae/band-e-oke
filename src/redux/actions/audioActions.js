import * as types from "./actionTypes";
import { toast } from "react-toastify";
import { showLoading, hideLoading } from 'react-redux-loading-bar'

export function processOverdubsComplete(result) {
  return { type: types.PROCESS_OVERDUBS_COMPLETE, result };
}

export function overdubsEmpty(result) {
  return { type: types.OVERDUBS_EMPTY, result };
}

export function processLoadedOverdubs(result) {
  return { type: types.PROCESS_LOADED_OVERDUBS, result };
}

export function processBackingTrackComplete(result) {
  return { type: types.PROCESS_BACKINGTRACK_COMPLETE, result };
}

export function processNewOverdubComplete(result) {
  return { type: types.PROCESS_NEW_OVERDUB_COMPLETE, result };
}

export function processingOverdubs(result) {
  return { type: types.PROCESSING_OVERDUBS, result };
}

export function processingBackingTrack(result) {
  return { type: types.PROCESSING_BACKINGTRACK, result };
}

export function processingNewOverdub(result) {
  return { type: types.PROCESSING_NEW_OVERDUB, result };
}

export function refreshOverdubParams(result) {
  return { type: types.REFRESH_OVERDUB_PARAMS, result };
}
