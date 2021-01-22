export default {
  apiCallsInProgress: 0,
  newOverdub: {
    nudge: 0,
    url: null,
    gain: 1,
  },
  overdubs: null,
  backingTrack: {
    buffer: null,
    nudge: 0,
    gain: 0.5
  },
  audio: {
    overdubsProcessing: false,
    overdubsComplete: false,
    refreshOverdubParams: false,
    backingTrackProcessing: false,
    backingTrackComplete: false,
    newOverdubProcessing: false,
    newOverdubComplete: true,
  },
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
  },
  currentUser: {
    currentUser: null
  }
};
