/* eslint-disable no-unused-expressions */

// Overdub template page using a class
import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import * as audioActions from "../../redux/actions/audioActions";
import * as overdubActions from "../../redux/actions/overdubActions";
import * as newOverdubActions from "../../redux/actions/newOverdubActions";
import { bindActionCreators } from "redux";
import Overdubs from "./Overdubs";

class OverdubsWrapper extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      overdubsPrepared: false,
      overdubNodes: [],
      newOverdub: null,
      backingTrack: {
        buffer: null,
        nudge: 0,
        gain: 0.5
      },
      allAudioLoaded: false,
      isReady: false
    }
  }

  componentDidUpdate(prevProps) {
    let {audioContext, newOverdub, actions} = this.props
    if (!this.allAudioLoaded()){
      this.loadAudio(prevProps)
      return
    }
    if (this.newRecording(prevProps)) {
      actions.processNewOverdub(audioContext, newOverdub)
      return
    }
    if (!this.state.overdubsPrepared) {
      this.prepareOverdubs()
      return
    }
    if (this.newOverdubToProcess() || this.props.audio.refreshOverdubParams) {
      this.setState({overdubsPrepared: false})
      return
    }
    this.playState(prevProps)
  }

  playState = (prevProps) => {
    let {playing} = this.props
    if(playing != null && playing !== prevProps.playing){
      this.playMix(this.props.audioContext, playing)
    }
  }

  newOverdubToProcess = () => {
    if (this.state.overdubNodes.length != this.props.overdubs.length) {
      return true
    }
    return false
  }

  overdubDataChanged = (prevProps) => {
    if (this.props.audio.refreshOverdubParams){
      return true
    }
    return false
  }

  newRecording = (prevProps) => {
    let {newOverdub} = this.props
    if (!newOverdub.url){
      return false
    }
    if (newOverdub.url !== prevProps.newOverdub.url) {
      return true;
    }
    return false;
  }

  allAudioLoaded = () => {
    let {audio} = this.props
    if (audio.overdubsComplete && audio.backingTrackComplete && audio.newOverdubComplete){
      return true
    }
    return false
  }

  loadNewOverdub = (prevProps) => {
    let {audio, newOverdub} = this.props
    if (audio.newOverdubComplete || audio.newOverdubProcessing) return false;
    if (newOverdub.url !== prevProps.newOverdub.url) return false;
    return true
  }

  loadOverdubs = () => {
    let {audio, overdubs} = this.props
    if (audio.overdubsComplete || audio.overdubsProcessing || overdubs.length == 0 ){
      return false
    }
    return true
  }

  loadBackingTrack = () => {
    let {audio} = this.props
    if(audio.backingTrackComplete || audio.backingTrackProcessing){
      return false
    }
    return true
  }

  loadAudio = (prevProps) => {
    let {apiCallsInProgress, audioContext, newOverdub, backingTrack, actions} = this.props
    if (apiCallsInProgress != 0) {
      return
    }
    if (this.loadOverdubs()){
      actions.processOverdubs(audioContext, Object.assign([], this.props.overdubs))
    }
    if (this.loadNewOverdub(prevProps)){
      actions.processNewOverdub(audioContext, newOverdub)
    }
    if (this.loadBackingTrack()) {
      actions.processBackingTrack(audioContext, backingTrack).then((buffer) => {
        const backingTrack = Object.assign({}, this.state.backingTrack);
        backingTrack.buffer = buffer
        this.setState({backingTrack: backingTrack});
      })
    }
  }

  playMix = (audioContext, playing) => {
    let count = audioContext.currentTime + 1
    this.toggleSingleAudioBuffer(this.state.backingTrack,'backingTrack', playing, count)
    this.toggleAudioBufferArray(this.state.overdubNodes, playing, count)
    this.toggleSingleAudioBuffer(this.props.newOverdub,'newOverdub', playing, count)
  }

  playAudioBuffer = (source, startTime, gain) => {
    // Set gain & start time (nudge) and play audio buffer
    var gainNode = this.props.audioContext.createGain();
    gainNode.gain.setValueAtTime(gain, this.props.audioContext.currentTime);
    source.connect(gainNode)
    gainNode.connect(this.props.audioContext.destination)
    source.start(startTime)
    return source
  }

  getSource = (buffer) => {
    let source  = this.props.audioContext.createBufferSource()
    source.buffer = buffer
    return source
  }

  toggleSingleAudioBuffer = (audio, key, toggle, count) => {
    // Toggle single simple audio buffer
    if (toggle === true) {

      let source = this.getSource(audio.buffer)
      this.playAudioBuffer(source, count + audio.nudge, audio.gain)
      this.setStateSimpleAudioBuffer(audio, key, source)

    } else if (toggle === false) {

      this.state[key].current.stop()
      this.setStateSimpleAudioBuffer(audio, key)
    }
  }

  setStateSimpleAudioBuffer = (audio, key, source={}) => {
    // Set current audio source
    const newAudio = Object.assign({}, audio);
    newAudio.current = source
    this.setState({[key]: newAudio})
  }

  toggleAudioBufferArray = (overdubs, toggle, count) => {
    // Toggle play an array of audio buffers
    if (toggle === true) {
      overdubs.forEach((overdub) => {
        let offset = count + overdub.nudge
        this.playAudioBuffer(overdub.source, offset, overdub.gain)
      })
    } else if (toggle === false) {
      overdubs.forEach((overdub) => {
        overdub.source.stop()
      })
      this.setState({overdubsPrepared: false})
      this.setState({overdubNodes: []})
    }
  }

  prepareOverdubs = () => {
    // Create array of audio source nodes for overdubs
    let freshOverdubs = Object.assign([], this.props.overdubs);
    let overdubNodes = []
    freshOverdubs.forEach((overdub) => {
      let source = this.getSource(overdub.buffer)
      overdub.source = source
      overdubNodes.push(overdub)
    })
    this.props.actions.refreshOverdubParams(false)
    this.setState({overdubNodes: overdubNodes})
    this.setState({overdubsPrepared: true})
  }

  render() {
    // When all nodes are prepared render Overdubs
    if (this.state.overdubNodes.length != this.props.overdubs.length) {
      return "still loading"
    }
    if (this.state.overdubsPrepared){
      return (
        <Overdubs disabled={this.props.disabled} playing={this.props.playing} overdubs={this.props.overdubs} overdubNodes={this.state.overdubNodes} video={false} audioContext={this.props.audioContext}/>
      )
    }
    return "loading"
  }
}

OverdubsWrapper.propTypes = {
  overdubs: PropTypes.array.isRequired,
  newOverdub: PropTypes.object,
  audio: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  backingTrack: PropTypes.string.isRequired,
  audioContext: PropTypes.object.isRequired,
  playing: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  apiCallsInProgress: PropTypes.number.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      processOverdubs: bindActionCreators(overdubActions.processOverdubs, dispatch),
      processBackingTrack: bindActionCreators(audioActions.processBackingTrack, dispatch),
      refreshOverdubParams: bindActionCreators(audioActions.refreshOverdubParams, dispatch),
      processNewOverdub: bindActionCreators(newOverdubActions.processNewOverdub, dispatch),
    }
  }
}

export default connect(null, mapDispatchToProps)(OverdubsWrapper);
