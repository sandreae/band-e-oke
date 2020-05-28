// File holds all of the item action creators
import * as types from "./actionTypes";
import * as audioActions from "./audioActions";
import uploadOverdub from "../../api/uploadOverdub";

export function setOverdubBlob(url) {
  return { type: types.SET_OVERDUB_BLOB, url };
}

export function nudgeNewOverdub(overdub) {
  return { type: types.NUDGE_NEW_OVERDUB, overdub };
}

export function setOverdubBuffer(overdub) {
  return { type: types.SET_NEW_OVERDUB_BUFFER, overdub };
}

async function processAudio(audioContext, file) {
  const response = await fetch(file)
  const arrayBuffer = await response.arrayBuffer()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  return audioBuffer
}

async function fetchBlob(blobUrl){
  let blob = await fetch(blobUrl).then(r => r.blob());
  return blob
}

export function processNewOverdub(audioContext, overdub) {
  return function(dispatch) {
    dispatch(audioActions.processingNewOverdub())
    processAudio(audioContext, overdub.url).then((buffer) => {
      overdub.buffer = buffer
      dispatch(setOverdubBuffer(overdub))
      dispatch(audioActions.processNewOverdubComplete())
    })
  }
}

export function upload(overdub){
  return function(){
    fetchBlob(overdub.url).then((blob) => {
      uploadOverdub(blob, overdub.nudge)
    })
  }
}
