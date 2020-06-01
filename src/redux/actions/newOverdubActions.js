// File holds all of the item action creators
import * as types from "./actionTypes";
import * as audioActions from "./audioActions";
import * as overdubActions from "./overdubActions";
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import axios from 'axios'
import { toast } from "react-toastify";
const baseUrl = process.env.API_URL

export function setOverdubBlob(url) {
  console.log(url)
  console.log('set overdub blob')
  return { type: types.SET_OVERDUB_BLOB, url };
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

export function uploadOverdub(file, nudge) {
  return dispatch => {
    let fileName = new Date()
    let fileType = 'webm'
    // dispatch is uploading
    return axios.post(baseUrl + 'sign_s3',{
        fileName : fileName,
        fileType : fileType
      })
      .then(response => {
        var returnData = response.data.data.returnData
        var signedRequest = returnData.signedRequest
        var url = returnData.url
        // dispatch set overdub url
        var options = {
          headers: {
            'Content-Type': fileType
          }
        }
        axios.put(signedRequest,file,options)
        .then(result => {
          const postData = async () => {
            try {
              const response = await axios.post(baseUrl + 'overdubs', {
                url: url,
                nudge: nudge,
              })
              dispatch(uploadSuccess())
            } catch (error) {
              dispatch(hideLoading())
            }
          }
          postData()
        })
      })
      .catch(error => {
        dispatch(uploadFailed(error))
      })
    }
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
  return function(dispatch){
    toast.success("Overdub uploading....");
    dispatch(showLoading())
    fetchBlob(overdub.url).then((blob) => {
      dispatch(uploadOverdub(blob, overdub.nudge))
    })
  }
}

export function uploadSuccess() {
  return function(dispatch) {
    toast.success("Overdub uploaded.");
    dispatch(removeNewOverdub())
    dispatch(overdubActions.loadOverdubs())
    dispatch(hideLoading())
  }
}

export function uploadFailed(error) {
  return function(dispatch) {
    toast.error("Uploading failed. " + error.message, { autoClose: false });
    dispatch(hideLoading())
  }
}
