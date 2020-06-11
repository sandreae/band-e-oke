export default {
  apiCallsInProgress: 0,
  newOverdub: {
    nudge: 0,
    url: null,
    gain: 1,
  },
  overdubs: [],
  audio: {
    overdubsProcessing: false,
    overdubsComplete: false,
    backingTrackProcessing: false,
    backingTrackComplete: false,
    newOverdubProcessing: false,
    newOverdubComplete: false,
  },
  users: [],
  media: {
    videoSyncSet: false,
    scoreOffset: -20,
    scoreStatus: '',
    streamStatus: '',
    videoStream: true
  },
  player: {
    playing: false,
    recording: false,
  },
  meta:{
    title: ''
  }
};
