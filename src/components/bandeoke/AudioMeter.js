import React, { Component } from 'react'
import { PropTypes } from "prop-types"
import WebAudioPeakMeter from '../../scripts/WebAudioPeakMeter';

class AudioMeter extends Component {
  constructor(props) {
    super(props)
    this.audioRef = React.createRef()
    this.meterRef = React.createRef()

    this.state = {
      meterRendered: false,
    };
  }

  componentDidMount(){
    this.initiateMeter()
  }

  componentDidUpdate() {
    this.playAudioBuffer()
  }

  playAudioBuffer = () => {
    // if audio is buffer array (ie. a new overdub), play audio element (otherwise it will be played from webaudio-context)
    if(this.props.isAudioBufferUrl){
      if(this.props.playing){
        this.audioRef.current.play()
      }
      if(!this.props.playing){
        this.audioRef.current.pause()
        this.audioRef.current.currentTime = 0
      }
    }
  }

  initiateMeter = () => {
    // Create instance of meter class
    let meter = WebAudioPeakMeter(this.props.audioNode);
    let sourceNode

    // If audio is buffer url create sourceNode from audio element using Ref
    this.props.isAudioBufferUrl ?
      sourceNode = this.props.audioContext.createMediaElementSource(this.audioRef.current) :
      sourceNode = this.props.audioNode

    // Create meter and attach to DOM using meterRef
    let meterNode = meter.createMeterNode(sourceNode, this.props.audioContext);
    meter.createMeter(this.meterRef.current, meterNode, {});

    // Change state
    this.setState(state => state.meterRendered = true);
  }

  renderAudioElement() {
    // Only render if audio is buffer url
    if (this.props.isAudioBufferUrl){
      return <audio crossOrigin="anonymous" preload="auto" type="audio/mpeg" src={this.props.audioUrl} ref={this.audioRef} style={{display: "none"}}/>
    }
  }

  render(){
    return (
      <span>
        {this.renderAudioElement()}
        <div ref={this.meterRef} id="new-overdub-peak-meter" style={{width: "200px", height: "150px"}}></div>
      </span>
    )
  }
}

AudioMeter.propTypes = {
  audioNode: PropTypes.object,
  audioUrl: PropTypes.string,
  playing: PropTypes.bool.isRequired,
  audioContext: PropTypes.object.isRequired,
  isAudioBufferUrl: PropTypes.bool.isRequired,
}

AudioMeter.defaultProps = {
  audioNode: {},
  audioUrl: "",
};

export default AudioMeter
