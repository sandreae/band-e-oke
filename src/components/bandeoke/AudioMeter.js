import React, { Component } from 'react'
import { PropTypes } from "prop-types"
import webAudioPeakMeter from '../../scripts/WebAudioPeakMeter';

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
    let meter = webAudioPeakMeter(this.props.audioNode);
    // sourceNode = this.props.audioContext.createBufferSource()
    let sourceNode
    this.props.isAudioUrl ?
      sourceNode = this.props.audioContext.createMediaElementSource(this.audioRef.current) :
      sourceNode = this.props.audioNode
    let meterNode = meter.createMeterNode(sourceNode, this.props.audioContext);
    meter.createMeter(this.meterRef.current, meterNode, {});
    this.setState(state => state.meterRendered = true);
  }

  componentDidUpdate() {
    if(this.props.isAudioUrl){
      if(this.props.playing){
        this.audioRef.current.play()
      }
      if(!this.props.playing){
        this.audioRef.current.pause()
        this.audioRef.current.currentTime = 0
      }
    }
  }

  renderAudioElement() {
    if (this.props.isAudioUrl){
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
  isAudioUrl: PropTypes.bool.isRequired,
}

AudioMeter.defaultProps = {
  audioNode: {},
  audioUrl: "",
};

export default AudioMeter
