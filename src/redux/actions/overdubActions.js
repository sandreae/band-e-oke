// File holds all of the overdub action creators
import * as types from "./actionTypes";
import * as overdubApi from "../../api/overdubApi";
import * as audioActions from "./audioActions";
import { beginApiCall, apiCallError } from "./apiStatusActions";
import { toast } from "react-toastify";
import { showLoading, hideLoading } from 'react-redux-loading-bar'

export function loadOverdubsSuccess(overdubs) {
  return { type: types.LOAD_OVERDUBS_SUCCESS, overdubs };
}

export function updateOverdubSuccess(overdub) {
  return { type: types.UPDATE_OVERDUB_SUCCESS, overdub };
}

export function createOverdubSuccess(overdub) {
  return { type: types.CREATE_OVERDUB_SUCCESS, overdub };
}

export function deleteOverdubOptimistic(overdub) {
  return { type: types.DELETE_OVERDUB_OPTIMISTIC, overdub };
}

export function nudgeOverdub(overdub) {
  return { type: types.NUDGE_OVERDUB, overdub };
}

export function setOverdubBuffers(overdubs) {
  return { type: types.SET_OVERDUB_BUFFERS, overdubs };
}

async function processAudioArray(audioContext, overdub) {
  const mergeOverdub = async (overdub, audioBuffer) => {
    overdub.buffer = audioBuffer
    return overdub
  }
  const response = await fetch(overdub.url)
  const arrayBuffer = await response.arrayBuffer()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  const overdubs = await mergeOverdub(overdub, audioBuffer)
  return overdubs
}

const fetchAudio = async (audioContext, fetchedOverdubs) => {
  const promises = fetchedOverdubs.map(async overdub => {
    return processAudioArray(audioContext, overdub)
  })
  const overdubsWithBuffers = await Promise.all(promises)
  return overdubsWithBuffers
}

export function processOverdubs(audioContext, fetchedOverdubs) {
  return function(dispatch){
    dispatch(showLoading())
    dispatch(audioActions.processingOverdubs())
    fetchAudio(audioContext, fetchedOverdubs).then((overdubsWithBuffers) => {
      dispatch(setOverdubBuffers(overdubsWithBuffers))
      dispatch(audioActions.processOverdubsComplete(true))
      dispatch(hideLoading())
    })
  }
}

//Thunks are defined below.  Used for async calls to the api.
export function loadOverdubs() {
  return function(dispatch) {
    dispatch(beginApiCall());
    dispatch(showLoading())
    return overdubApi
      .getOverdubs()
      .then(overdubs => {
        dispatch(loadOverdubsSuccess(overdubs));
        dispatch(audioActions.processOverdubsComplete(false))
        toast.success("Overdubs loaded.");
        dispatch(hideLoading())
        return overdubs
      })
      .catch(error => {
        dispatch(apiCallError(error));
        toast.error("Fetching overdubs failed. " + error.message, { autoClose: false });
        throw error;
      });
  };
}

export function saveOverdub(overdub) {
  // eslint-disable-next-line no-unused-vars
  return function(dispatch, getState) {
    dispatch(beginApiCall());
    return overdubApi
      .saveOverdub(overdub)
      .then(savedOverdub => {
        overdub.id
          ? dispatch(updateOverdubSuccess(savedOverdub))
          : dispatch(createOverdubSuccess(savedOverdub));
      })
      .catch(error => {
        dispatch(apiCallError(error));
        throw error;
      });
  };
}

export function deleteOverdub(overdub) {
  return function(dispatch) {
    // Doing optimistic delete, so not dispatching begin/end api call
    // actions, or apiCallError action since we're not showing the loading status for this.
    dispatch(deleteOverdubOptimistic(overdub));
    return overdubApi.deleteOverdub(overdub.id);
  };
}
