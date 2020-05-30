// File holds all of the item action creators
import * as types from "./actionTypes";
import { toast } from "react-toastify";

export function setVideoSync(syncerEl) {
  return { type: types.SET_VIDEO_SYNC, syncerEl };
}

export function addVideoSyncChildren(children) {
  return { type: types.ADD_SYNC_CHILDREN, children };
}

export function offsetScore(scoreOffset) {
  return { type: types.OFFSET_SCORE, scoreOffset };
}

export function scoreStatus(scoreStatus) {
  return { type: types.SCORE_STATUS, scoreStatus };
}

export function streamStatus(streamStatus) {
  return { type: types.STREAM_STATUS, streamStatus };
}

export function videoStream(videoStream) {
  return { type: types.VIDEO_STREAM, videoStream };
}

export function scoreLoading(status) {
  return function(dispatch) {
    if (status === 'loading'){
      toast.success("Score loading.......")
      toast.success("....this might take a while")
    }
    if (status === 'ready'){
      toast.success("Score loaded!")
    }
    dispatch(scoreStatus(status))
  }
}
