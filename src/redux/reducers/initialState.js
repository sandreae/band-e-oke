export default {
  apiCallsInProgress: 0,
  newOverdub: {
    nudge: 0,
    url: null,
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
};


// audio {
//   backingTrack
//   backingTrackBuffer
//   fetchedOverdubs
//   fetchedOverdubsBuffer
//   newOverdub
//   newOverdubBuffer
// }
//
// newOverdub{
//   blob
//   url
// }

// appReady
// backingTrackPlaying
// dataChange
// isRecording
// isUploading
// mediaReady
// mixPlaying
// overdubPresent
// recordingOverdub
// recordingUrl
// showVideo
// streamReady
