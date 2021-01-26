import React, { Component } from 'react'
import { PropTypes } from "prop-types"
import Nexus from "nexusui"

class AudioMeter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      source: null,
      meterRendered: false,
      gainNode: null,
      id: Math.random().toString(36),
    };
  }

  componentDidMount(){
    let gainNode = this.props.audioContext.createGain();
    let source = this.createSource()
    let meter = this.initMeter()
    meter.colorize("accent", "blue")
    gainNode.gain.setValueAtTime(0, this.props.audioContext.currentTime);
    gainNode.connect(this.props.audioContext.destination)
    meter.connect(gainNode)
    this.setState(() => ({
      gainNode: gainNode,
      source: source,
      meter: meter,
    }));
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

  initMeter(){
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
}

export default AudioMeter
