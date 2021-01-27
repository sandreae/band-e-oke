import React, { Component } from 'react'
import { PropTypes } from "prop-types"
import Nexus from "nexusui"

class AudioMeter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      meter: null,
      source: null,
      gainNode: null,
      id: Math.random().toString(36),
    };
  }

  componentDidMount(){
    let state = {}
    state.meter = this.createMeter()
    if (this.props.overdub || this.props.stream) {
      state.gainNode = this.props.audioContext.createGain();
      state.source = this.createSource()
      this.connectAudio(state.gainNode, state.meter)
    }
    this.setState(() => ({...state}));
  }

  componentDidUpdate(prevProps) {
    if(this.props.stream) {
      this.state.meter.connect(this.state.source)
    }
    if (!this.state.source) {
      let source = this.createSource()
      this.setState(() => ({source: source}));
      source.connect(this.state.gainNode)
      return
    }
    this.play(prevProps)
  }

  connectAudio(gainNode, meter){
    meter.colorize("accent", "blue")
    gainNode.gain.setValueAtTime(0, this.props.audioContext.currentTime);
    gainNode.connect(this.props.audioContext.destination)
    meter.connect(gainNode)
  }

  createMeter(){
    let meter
    if (this.props.type == "oscilloscope"){
      meter = new Nexus.Oscilloscope("#meter-" + this.state.id)
    } else {
      meter = new Nexus.Meter("#meter-" + this.state.id)
    }
    meter.colorize("accent", "blue")
    return meter
  }

  playAudioBuffer = () => {
    // Set gain & start time (nudge) and play audio buffer
    let {nudge, gain} = this.props.overdub
    let source = this.state.source
    this.state.gainNode.gain.setValueAtTime(gain, this.props.audioContext.currentTime);
    source.connect(this.state.gainNode)
    source.start(this.props.audioContext.currentTime, nudge)
  }

  play = (prevProps) => {
    if(this.props.stream) return

    if(this.props.playing && !prevProps.playing){
      this.playAudioBuffer()
    }
    if(!this.props.playing && prevProps.playing){
      this.state.source.stop()
      this.setState(() => ({source: null}));
    }
  }

  createSource = () => {
    let source
    if (this.props.stream) {
      source = this.props.audioContext.createMediaStreamSource(this.props.stream);
    } else {
      source = this.props.audioContext.createBufferSource()
      source.buffer = this.props.overdub.buffer
    }
    return source
  }

  render(){
    return (
      <div id={`meter-${this.state.id}`} className="audio-meter"></div>
    )
  }
}

AudioMeter.propTypes = {
  audioContext: PropTypes.object.isRequired,
  overdub: PropTypes.object,
  playing: PropTypes.bool.isRequired,
  stream: PropTypes.object,
  type: PropTypes.string,
}

AudioMeter.defaultProps = {
  type: "meter",
  overdub: null,
}

export default AudioMeter
