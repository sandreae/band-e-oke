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
    sidebarActive: false,
  },
  meta:{
    title: ''
  },
  currentUser: {
    username: null,
    fetchingUser: true,
  },
};
