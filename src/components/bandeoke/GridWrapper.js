/* eslint-disable no-unused-expressions */

// Overdub template page using a class
import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import * as audioActions from "../../redux/actions/audioActions";
import * as overdubActions from "../../redux/actions/overdubActions";
import * as newOverdubActions from "../../redux/actions/newOverdubActions";
import { bindActionCreators } from "redux";
import VideoGrid from "./VideoGrid";

class GridPlayer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      overdubsPrepared: false,
      overdubNodes: [],
      newOverdub: {},
      backingTrack: {},
    }
  }

  componentDidMount(){
    this.prepareOverdubs()
  }

  componentDidUpdate(prevProps) {
    let {playing} = this.props
    if(playing != null && playing !== prevProps.playing){
      this.playMix(this.props.audioContext, playing)
    }
    if (!this.state.overdubsPrepared || this.props.overdubs != prevProps.overdubs){
      this.setState({overdubsPrepared: false})
      this.prepareOverdubs()
    }
  }

  playMix = (audioContext, playing) => {
    let count = audioContext.currentTime + 0.5
    this.playAudio(this.props.backingTrack,'backingTrack', playing, count)
    this.props.newOverdub ? this.playAudio(this.props.newOverdub,'newOverdub', playing, count) : null
    this.playAudioArray(this.state.overdubNodes, playing, count)
  }

  playBuffer(source, startTime, gain){
    var gainNode = this.props.audioContext.createGain();
    gainNode.gain.setValueAtTime(gain, this.props.audioContext.currentTime);
    source.connect(gainNode)
    gainNode.connect(this.props.audioContext.destination)
    source.start(startTime)
    return source
  }

  getSource(buffer){
    let source  = this.props.audioContext.createBufferSource()
    source.buffer = buffer
    return source
  }

  playAudio = (audio, key, toggle, count) => {
    if (toggle === true) {

      let source = this.getSource(audio.buffer)
      this.playBuffer(source, count + audio.nudge, audio.gain)

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

  playAudioArray = (overdubs, toggle, count) => {
    if (toggle === true) {
      overdubs.forEach((overdub) => {
        let offset = count + overdub.nudge
        this.playBuffer(overdub.source, offset, overdub.gain)
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
    let overdubNodes = []
    this.props.overdubs.forEach((overdub) => {
      let source = this.getSource(overdub.buffer)
      overdub.source = source
      overdubNodes.push(overdub)
    })
    this.setState({overdubNodes: overdubNodes})
    this.setState({overdubsPrepared: true})
  }

  render() {
    if (this.state.overdubNodes.length === this.props.overdubs.length) {
      return (
        <VideoGrid disabled={this.props.disabled} playing={this.props.playing} overdubs={this.props.overdubs} overdubNodes={this.state.overdubNodes} video={false} audioContext={this.props.audioContext}/>
      )
    }
    return null
  }
}

GridPlayer.propTypes = {
  overdubs: PropTypes.array.isRequired,
  newOverdub: PropTypes.object,
  backingTrack: PropTypes.object.isRequired,
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

export default connect(null, mapDispatchToProps)(GridPlayer);
