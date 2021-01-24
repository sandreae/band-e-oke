import React, { Component } from 'react'
import { PropTypes } from "prop-types"
import Nexus from "nexusui"

class AudioMeter extends Component {
  constructor(props) {
    super(props)

    this.handleTabletChange = this.handleTabletChange.bind(this);

    this.state = {
      source: null,
      meterRendered: false,
      gainNode: null,
      width: this.props.mobile_width,
      height: this.props.mobile_height,
    };
  }

  componentDidMount(){
    this.checkScreen()
    let gainNode = this.props.audioContext.createGain();
    let source = this.createSource()
    let meter = new Nexus.Meter("#meter-" + this.props.id, {
      size: [this.state.width, this.state.height],
    })
    gainNode.gain.setValueAtTime(0, this.props.audioContext.currentTime);
    gainNode.connect(this.props.audioContext.destination)
    meter.connect(gainNode)
    this.setState(() => ({
      gainNode: gainNode,
      source: source,
      meter: meter,
    }));
  }

  handleTabletChange(e) {
    // Check if the media query is true
    if (e.matches) {
      this.setState(() => ({
        width: this.props.desktop_width,
        height: this.props.desktop_height,
      }));
    } else {
      this.setState(() => ({
        width: this.props.mobile_width,
        height: this.props.mobile_height,
      }));
    }
  }

  checkScreen(){
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    this.handleTabletChange(mediaQuery)
    mediaQuery.addListener(this.handleTabletChange)
  }

  componentDidUpdate(prevProps) {
    console.log(this.state)
    this.state.meter.resize(this.state.width, this.state.height)
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
      <div id={`meter-${this.props.id}`} className="audio-meter"></div>
    )
  }
}

AudioMeter.propTypes = {
  audioContext: PropTypes.object.isRequired,
  overdub: PropTypes.object,
  playing: PropTypes.bool.isRequired,
  stream: PropTypes.object,
  id: PropTypes.string.isRequired,
  mobile_width: PropTypes.number,
  mobile_height: PropTypes.number,
  desktop_width: PropTypes.number,
  desktop_height: PropTypes.number,
}

AudioMeter.defaultProps = {
  id: Math.random().toString(36),
  mobile_width: 100,
  mobile_height: 100,
  desktop_width: 200,
  desktop_height: 200,
}

export default AudioMeter
