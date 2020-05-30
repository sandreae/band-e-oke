// File holds item reducer
// Reducers specify how the application's state changes in response to actions sent to the store.
import * as types from "../actions/actionTypes";
import initialState from "./initialState";
import { MediaElementSyncer } from 'media-element-syncer'

const isSyncSet = (currentSync, syncerEl) => {
  const newSyncer = new MediaElementSyncer(syncerEl)
  return Object.assign({}, currentSync, {
    videoSyncSet: true,
    current: newSyncer
  })
}

const addChildren = (syncer, children) => {
  console.log(syncer)
  children.forEach((child) => {
    syncer.current.addChild(child)
  })
  return syncer
}

export default function mediaReducer(state = initialState.media, action) {
  switch (action.type) {
    case types.SET_VIDEO_SYNC:
      return isSyncSet(state, action.syncerEl)
    case types.ADD_SYNC_CHILDREN:
      return addChildren(state, action.children)
    case types.OFFSET_SCORE:
      return Object.assign({}, state, {
         scoreOffset: action.scoreOffset
      })
    case types.SCORE_STATUS:
      return Object.assign({}, state, {
         scoreStatus: action.scoreStatus
      })
    case types.STREAM_STATUS:
      return Object.assign({}, state, {
         streamStatus: action.streamStatus
      })
    case types.VIDEO_STREAM:
      return Object.assign({}, state, {
         videoStream: action.videoStream,
         streamStatus: ''
      })
    default:
      return state;
  }
}
