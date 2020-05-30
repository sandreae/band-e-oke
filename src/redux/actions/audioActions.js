import * as types from "./actionTypes";
import { toast } from "react-toastify";
import { showLoading, hideLoading } from 'react-redux-loading-bar'

export function processOverdubsComplete(result) {
  return { type: types.PROCESS_OVERDUBS_COMPLETE, result };
}

export function processBackingTrackComplete(result) {
  return { type: types.PROCESS_BACKINGTRACK_COMPLETE, result };
}

export function processNewOverdubComplete(result) {
  return { type: types.PROCESS_NEW_OVERDUB_COMPLETE, result };
}

export function processingOverdubs(result) {
  return { type: types.PROCESS_OVERDUBS, result };
}

export function processingBackingTrack(result) {
  return { type: types.PROCESS_BACKINGTRACK, result };
}

export function processingNewOverdub(result) {
  return { type: types.PROCESS_NEW_OVERDUB, result };
}

async function processAudio(audioContext, file) {
  const response = await fetch(file)
  const arrayBuffer = await response.arrayBuffer()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  return audioBuffer
}

export function processBackingTrack(audioContext, backingTrack) {
  return function(dispatch) {
    dispatch(showLoading())
    dispatch(processingBackingTrack())
    const audio = processAudio(audioContext, backingTrack)
      .then((audio) => {
        dispatch(processBackingTrackComplete())
        toast.success("Backing track audio ready. ");
        dispatch(hideLoading())
        return audio
      }
    )
    return audio
  }
}
