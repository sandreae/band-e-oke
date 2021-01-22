import React, { Component } from 'react'
import { PropTypes } from "prop-types"
import WebAudioPeakMeter from '../../scripts/WebAudioPeakMeter';

class AudioMeter extends Component {
  constructor(props) {
    super(props)
    this.audioRef = React.createRef()
    this.meterRef = React.createRef()

    this.state = {
      source: null,
      meterRendered: false
    };
  }

  componentDidMount(){
    this.setState(state => state.source = this.createSource());
  }

  componentDidUpdate(prevProps) {
    if (!this.state.source) {
      this.setState(state => state.source = this.createSource());
      return
    } else if (!this.state.meterRendered) {
      this.initiateMeter()
      this.setState(state => state.meterRendered = true);
    }
    this.play(prevProps)
  }

  playAudioBuffer = () => {
    // Set gain & start time (nudge) and play audio buffer
    let {nudge, gain} = this.props.overdub
    let source = this.state.source
    let gainNode = this.props.audioContext.createGain();
    gainNode.gain.setValueAtTime(gain, this.props.audioContext.currentTime);
    source.connect(gainNode)
    gainNode.connect(this.props.audioContext.destination)
    source.start(this.props.audioContext.currentTime, nudge)
  }

  play = (prevProps) => {
    if(this.props.stream) return

    if(this.props.playing && !prevProps.playing){
      this.playAudioBuffer()
    }
    if(!this.props.playing && prevProps.playing){
      console.log(this.state.source)
      this.state.source.stop()
      this.setState(state => state.source = null);
      this.setState(state => state.meterRendered = false);
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

  initiateMeter = () => {
    // Create instance of meter class
    let meter = WebAudioPeakMeter();
    let meterNode = meter.createMeterNode(this.state.source, this.props.audioContext);
    meter.createMeter(this.meterRef.current, meterNode, {});
  }

  render(){
    if (this.state.source){
      return (
        <span>
        <div ref={this.meterRef} id="new-overdub-peak-meter" style={{width: "200px", height: "150px"}}></div>
        </span>
      )
    } else {return "loading"}
  }
}

AudioMeter.propTypes = {
  audioContext: PropTypes.object.isRequired,
  overdub: PropTypes.object,
  playing: PropTypes.bool.isRequired,
  stream: PropTypes.object,
}

export default AudioMeter
