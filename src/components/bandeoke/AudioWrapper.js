/* eslint-disable no-unused-expressions */

// Overdub template page using a class
import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import * as audioActions from "../../redux/actions/audioActions";
import * as overdubActions from "../../redux/actions/overdubActions";
import * as newOverdubActions from "../../redux/actions/newOverdubActions";
import { bindActionCreators } from "redux";
import GridWrapper from "./GridWrapper";

class AudioWrapper extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      overdubsWithBuffers: [],
      newOverdubWithBuffer: false,
      backingTrackWithBuffer: false,
    }
  }

  componentDidUpdate(prevProps) {
    console.log('COMPONENT DID UPDATE')
    let {audioContext, overdubs, audio, newOverdub, backingTrack, actions} = this.props
    if (audio.overdubsProcessing && this.state.overdubsWithBuffers.length !== 0){this.setState({overdubsWithBuffers: []})}
    if (overdubs.length !== 0 && !audio.overdubsProcessing && !audio.overdubsComplete){
      actions.processOverdubs(audioContext, overdubs).then((overdubsWithBuffers) => {
        console.log(overdubsWithBuffers)
        this.setState({overdubsWithBuffers: overdubsWithBuffers})
      })
    }
    if (newOverdub.url && newOverdub.url !== prevProps.newOverdub.url){
      console.log('PROCESS NEW OVERDUB')
      actions.processNewOverdub(audioContext, newOverdub).then((newOverdubWithBuffer) => {
        console.log(newOverdubWithBuffer)
        this.setState({newOverdubWithBuffer: newOverdubWithBuffer})
      })
    }
    if (backingTrack && !audio.backingTrackComplete && !audio.backingTrackProcessing){
      actions.processBackingTrack(audioContext, backingTrack).then((buffer) => {
        const backingTrackWithBuffer = Object.assign({}, this.state.backingTrackWithBuffer);
        backingTrackWithBuffer.buffer = buffer
        backingTrackWithBuffer.gain = 0.5
        backingTrackWithBuffer.nudge = 0
        this.setState({backingTrackWithBuffer: backingTrackWithBuffer});
      })
    }
    // if(playing && playing !== prevProps.playing){
    //   this.playMix(audioContext, playing)
    // }
    // if(!playing && playing !== prevProps.playing){
    //   this.playMix(audioContext, playing)
    // }
    // if(audio.overdubsComplete && !this.state.overdubsPrepared){
    //   overdubs.map((overdub) => {
    //     let source  = this.props.audioContext.createBufferSource()
    //     source.buffer = overdub.buffer
    //     overdub.current = source
    //     return overdub
    //   })
    //   console.log(overdubs)
    //   this.setState({overdubBuffers: overdubs})
    //   this.setState({overdubsPrepared: true})
    // }
  }

  render() {
    let {audio, newOverdub, playing, overdubs, audioContext, disabled} = this.props
    if (!audio.overdubsProcessing && audio.overdubsComplete && audio.backingTrackComplete){
      console.log('FINISHED!!!!')
      return <GridWrapper overdubs={overdubs} newOverdub={newOverdub} playing={playing} backingTrack={this.state.backingTrackWithBuffer} disabled={disabled} audioContext={audioContext}/>
    } else {return "loading..."}
  }
}

AudioWrapper.propTypes = {
  overdubs: PropTypes.array.isRequired,
  newOverdub: PropTypes.object,
  audio: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  backingTrack: PropTypes.string.isRequired,
  audioContext: PropTypes.object.isRequired,
  playing: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      processOverdubs: bindActionCreators(overdubActions.processOverdubs, dispatch),
      processBackingTrack: bindActionCreators(audioActions.processBackingTrack, dispatch),
      processNewOverdub: bindActionCreators(newOverdubActions.processNewOverdub, dispatch),
    }
  }
}

export default connect(null, mapDispatchToProps)(AudioWrapper);
