/* eslint-disable no-unused-expressions */

// Overdub template page using a class
import React from "react";
import * as overdubApi from "../../api/overdubApi";
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
      // backingTrack: {
      //   buffer: null,
      //   nudge: 0,
      //   gain: 0.5
      // },
      // allAudioLoaded: false,
      // isReady: false
    }
  }

  componentDidMount(){
    console.log("OverdubWrapper Mounted")
    // let {audioContext, backingTrack, actions} = this.props
    // overdubApi.loadBackingTrack(audioContext, backingTrack).then((buffer) => {
    //   console.log("BACKING TRACK BUFFER LOADED")
    // })
  }

  componentDidUpdate(prevProps) {
    console.log("OverdubWrapper Updated")
    // if (!this.allAudioLoaded()){
    //   this.loadAudio(prevProps)
    //   return
    // }
    // if (this.newRecording(prevProps)) {
    //   actions.processNewOverdub(audioContext, newOverdub)
    //   return
    // }
    if (!this.state.overdubsPrepared && this.props.overdubs) {
      console.log("PREPARE OVERDUB BUFFERS")
      overdubApi.createOverdubBufferSources(this.props.audioContext, this.props.overdubs).then((overdubs)=>{
        this.setState({overdubsPrepared: true})
        console.log(overdubs)
      })
      return
    }
    // if (this.newOverdubToProcess() || this.props.audio.reloadOverdubs) {
    //   this.setState({overdubsPrepared: false})
    //   return
    // }
    this.playState(prevProps)
  }

  playState = (prevProps) => {
    let {playing} = this.props
    if(playing != null && playing !== prevProps.playing){
      this.playMix(this.props.audioContext, playing)
    }
  }

  // newOverdubToProcess = () => {
  //   if (this.state.overdubNodes.length != this.props.overdubs.length) {
  //     return true
  //   }
  //   return false
  // }

  // overdubDataChanged = (prevProps) => {
  //   if (this.props.audio.reloadOverdubs){
  //     return true
  //   }
  //   return false
  // }
  //
  // newRecording = (prevProps) => {
  //   let {newOverdub} = this.props
  //   if (!newOverdub.url){
  //     return false
  //   }
  //   if (newOverdub.url !== prevProps.newOverdub.url) {
  //     return true;
  //   }
  //   return false;
  // }

  // allAudioLoaded = () => {
  //   let {audio} = this.props
  //   if (audio.overdubsComplete && audio.backingTrackComplete && audio.newOverdubComplete){
  //     return true
  //   }
  //   return false
  // }
  //
  // loadNewOverdub = () => {
  //   let {audio} = this.props
  //   if (audio.newOverdubComplete || audio.newOverdubProcessing) return false;
  //   return true
  // }
  //
  loadOverdubs = () => {
    let {audio, overdubs} = this.props
    if (audio.overdubsComplete || audio.overdubsProcessing || overdubs.length == 0 ){
      return false
    }
    return true
  }

  // loadBackingTrack = () => {
  //   let {audio} = this.props
  //   if(audio.backingTrackComplete || audio.backingTrackProcessing){
  //     return false
  //   }
  //   return true
  // }
  //
  // loadAudio = (prevProps) => {
  //   let {apiCallsInProgress, audioContext, newOverdub, backingTrack, actions} = this.props
    // if (apiCallsInProgress != 0) {
    //   return
    // }
    // if (this.loadOverdubs() && !this.state.overdubsPrepared){
    //   actions.processOverdubs(audioContext, Object.assign([], this.props.overdubs)).then((overdubs)=>{
    //     console.log(overdubs)
    //     this.setState({overdubsPrepared: true})
    //   })
    // }
    // if (this.loadNewOverdub(prevProps)){
    //   actions.processNewOverdub(audioContext, newOverdub).then((newOverdub)=>{
    //     console.log(newOverdub)
    //   })
    // }
  //   if (this.loadBackingTrack()) {
  //     actions.processBackingTrack(audioContext, backingTrack).then((buffer) => {
  //       const backingTrack = Object.assign({}, this.state.backingTrack);
  //       backingTrack.buffer = buffer
  //       this.setState({backingTrack: backingTrack});
  //     })
  //   }
  // }

  playMix = (audioContext, playing) => {
    let count = audioContext.currentTime + 1
    this.playSingleAudioBuffer(this.props.backingTrack,'backingTrack', playing, count)
    this.playAudioBufferArray(this.state.overdubNodes, playing, count)
    this.playSingleAudioBuffer(this.props.newOverdub,'newOverdub', playing, count)
  }

  playAudioBuffer = (source, nudge, gain, count=0) => {
    // Set gain & start time (nudge) and play audio buffer
    let offset = count + nudge
    var gainNode = this.props.audioContext.createGain();
    gainNode.gain.setValueAtTime(gain, this.props.audioContext.currentTime);
    source.connect(gainNode)
    gainNode.connect(this.props.audioContext.destination)
    source.start(offset)
    return source
  }

  getSource = (buffer) => {
    let source  = this.props.audioContext.createBufferSource()
    source.buffer = buffer
    return source
  }

  playSingleAudioBuffer = (audio, key, toggle, count) => {
    // Toggle single simple audio buffer
    if (toggle === true) {

      let source = this.getSource(audio.buffer)
      this.setStateSimpleAudioBuffer(audio, key, source)
      this.playAudioBuffer(source, audio.nudge, audio.gain, count)

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

  playAudioBufferArray = (overdubs, toggle, count) => {
    // Toggle play an array of audio buffers
    if (toggle === true) {
      overdubs.forEach((overdub) => {
        this.playAudioBuffer(overdub.source, overdub.nudge, overdub.gain, count)
      })
    } else if (toggle === false) {
      overdubs.forEach((overdub) => {
        overdub.source.stop()
      })
      this.setState({overdubsPrepared: false})
      this.setState({overdubNodes: []})
    }
  }

  // prepareOverdubs = () => {
  //   // Create array of audio source nodes for overdubs
  //   let freshOverdubs = Object.assign([], this.props.overdubs);
  //   let overdubNodes = []
  //   freshOverdubs.forEach((overdub) => {
  //     let source = this.getSource(overdub.buffer)
  //     overdub.source = source
  //     overdubNodes.push(overdub)
  //   })
  //   // this.props.actions.reloadOverdubs(false)
  //   this.setState({overdubNodes: overdubNodes})
  //   this.setState({overdubsPrepared: true})
  // }

  render() {
    // When all nodes are prepared render Overdubs
    if (this.state.overdubsPrepared){
      console.log("RENDER OVERDUBS")
      console.log(this.props)
      return (
        <Overdubs disabled={this.props.disabled} playing={this.props.playing} overdubs={this.props.overdubs} overdubNodes={this.state.overdubNodes} video={false} audioContext={this.props.audioContext}/>
      )
    }
    return "loading"
  }
}

OverdubsWrapper.propTypes = {
  actions: PropTypes.object.isRequired,
  audio: PropTypes.object.isRequired,
  backingTrack: PropTypes.object.isRequired,
  audioContext: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  newOverdub: PropTypes.object,
  overdubs: PropTypes.array,
  playing: PropTypes.bool.isRequired,
  recording: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    audio: state.audio,
    backingTrack: state.backingTrack,
    loading: state.apiCallsInProgress > 0,
    newOverdub: state.newOverdub,
    overdubs: state.overdubs,
    playing: state.player.playing,
    recording: state.player.recording,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      // processOverdubs: bindActionCreators(overdubActions.processOverdubs, dispatch),
      // processBackingTrack: bindActionCreators(audioActions.processBackingTrack, dispatch),
      // processOverdubsComplete: bindActionCreators(audioActions.processOverdubsComplete, dispatch),
      // reloadOverdubs: bindActionCreators(audioActions.reloadOverdubs, dispatch),
      // processNewOverdub: bindActionCreators(newOverdubActions.processNewOverdub, dispatch),
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverdubsWrapper);
