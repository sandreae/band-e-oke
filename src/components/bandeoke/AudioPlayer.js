/* eslint-disable no-unused-expressions */

// Overdub template page using a class
import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import * as audioActions from "../../redux/actions/audioActions";
import * as overdubActions from "../../redux/actions/overdubActions";
import * as newOverdubActions from "../../redux/actions/newOverdubActions";
import { bindActionCreators } from "redux";

class AudioPlayer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      overdubs: [{
        current: {},
      }],
      newOverdub: {
        current: {},
      },
      backingTrack: {
        buffer: null,
        current: {},
        nudge: 0
      },
    }
  }

  componentDidUpdate(prevProps) {

    let {playing, audioContext, overdubs, audio, newOverdub, backingTrack, actions} = this.props

    if (overdubs.length !== 0 && !audio.overdubsProcessing && !audio.overdubsComplete){
      actions.processOverdubs(audioContext, overdubs)
    }
    if (newOverdub.url && newOverdub !== prevProps.newOverdub){
      if (newOverdub.url !== prevProps.newOverdub.url) {
        actions.processNewOverdub(audioContext, newOverdub)
      }
    }
    if (backingTrack && !audio.backingTrackComplete && !audio.backingTrackProcessing){
      actions.processBackingTrack(audioContext, backingTrack).then((buffer) => {
        const newBackingTrack = Object.assign({}, this.state.backingTrack);
        newBackingTrack.buffer = buffer
        newBackingTrack.gain = 0.5
        this.setState({backingTrack: newBackingTrack});
      })
    }
    if(playing && playing !== prevProps.playing){
      this.playMix(audioContext, playing)
    }
    if(!playing && playing !== prevProps.playing){
      this.playMix(audioContext, playing)
    }
  }

  playMix = (audioContext, playing) => {
    let {backingTrack} = this.state
    let {newOverdub, overdubs} = this.props
    let count = audioContext.currentTime + 0.5
    this.playAudio(backingTrack,'backingTrack', playing, count)
    newOverdub.buffer ? this.playAudio(newOverdub,'newOverdub', playing, count) : null
    this.playOverdubs(overdubs, playing, count)
  }

  playBuffer(buffer, startTime, gain){
    let source  = this.props.audioContext.createBufferSource()
    var gainNode = this.props.audioContext.createGain();
    gainNode.gain.setValueAtTime(gain, this.props.audioContext.currentTime);
    source.buffer = buffer
    source.connect(gainNode)
    gainNode.connect(this.props.audioContext.destination)
    source.start(startTime)
    return source
  }

  playOverdubs = (overdubs, toggle, count) => {
    if (toggle === true) {
      overdubs.map((overdub) => {
        let offset = count + overdub.nudge
        let source = this.playBuffer(overdub.buffer, offset, overdub.gain)
        overdub.current = source
        return overdub
      })
      this.setState({overdubs: overdubs})

    } else if (toggle === false) {
      overdubs.map((overdub) => {
        overdub.current.stop()
        overdub.current = null
        return overdub
      })
      this.setState({overdubs: overdubs})
    }
  }

  playAudio = (audio, key, toggle, count) => {
    if (toggle === true) {

      let source = this.playBuffer(audio.buffer, count + audio.nudge, audio.gain)

      const newAudio = Object.assign({}, audio);
      newAudio.current = source
      this.setState({[key]: newAudio})

    } else if (toggle === false) {

      this.state[key].current.stop()

      const newAudio = Object.assign({}, audio);
      newAudio.current = {}
      this.setState({[key]: newAudio})
    }
  }

  render() {
    if (this.props.overdubs.length === 0) {
      return null
    }
    return (
      <div className='flex' wrap='true'>
      </div>
    )
  }
}

AudioPlayer.propTypes = {
  overdubs: PropTypes.array.isRequired,
  newOverdub: PropTypes.object.isRequired,
  audio: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  backingTrack: PropTypes.string.isRequired,
  audioContext: PropTypes.object.isRequired,
  playing: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    overdubs: state.overdubs,
    audio: state.audio,
    newOverdub: state.newOverdub,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      processOverdubs: bindActionCreators(overdubActions.processOverdubs, dispatch),
      processBackingTrack: bindActionCreators(audioActions.processBackingTrack, dispatch),
      processNewOverdub: bindActionCreators(newOverdubActions.processNewOverdub, dispatch),
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
