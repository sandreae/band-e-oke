import React, { Component } from 'react'
import PropTypes from "prop-types";
import webAudioPeakMeter from '../../scripts/WebAudioPeakMeter';
import { connect } from "react-redux";
import * as mediaActions from "../../redux/actions/mediaActions";
import * as newOverdubActions from "../../redux/actions/newOverdubActions";
import { bindActionCreators } from "redux";
import Button from "./Button";

class OverdubVideo extends Component {

  constructor(props) {
    super(props)
    this.newOverdubRef = React.createRef()
    this.nowOverdubMeterRef = React.createRef()

    this.handleNudgeOverdub = this.handleNudgeOverdub.bind(this);
    this.handleDeleteOverdub = this.handleDeleteOverdub.bind(this);
    this.handleGainOverdub = this.handleGainOverdub.bind(this);

    this.state = {
      meterRendered: false,
    };
  }

  componentDidUpdate(prevProps) {
    if(this.props.newOverdub.url && !this.state.meterRendered || this.props.newOverdub.url != prevProps.newOverdub.url && this.props.newOverdub.url){
      var meter = webAudioPeakMeter();
      var sourceNode = this.props.audioContext.createMediaElementSource(this.newOverdubRef.current);
      var meterNode = meter.createMeterNode(sourceNode, this.props.audioContext);
      meter.createMeter(this.nowOverdubMeterRef.current, meterNode, {});
      this.setState(state => state.meterRendered = true);
    }
    if(this.props.newOverdub.url && this.props.playing){
      this.newOverdubRef.current.play()
    }
    if(this.props.newOverdub.url && !this.props.playing){
      this.newOverdubRef.current.pause()
      this.newOverdubRef.current.currentTime = 0
    }
  }

  handleNudgeOverdub = (overdub, e) => {
    overdub.nudge = parseFloat(e.target.value)
    this.props.actions.nudgeNewOverdub(overdub)
  }

  onUploadClick = () => {
    this.props.actions.upload(this.props.newOverdub)
  }

  handleDeleteOverdub = (url) => {
    this.props.actions.removeNewOverdub(url);
  };

  handleGainOverdub = (overdub, e) => {
    overdub.gain = parseFloat(e.target.value)
    this.props.actions.gainNewOverdub(overdub);
  };

  renderVisuals(){
    return (
      <span>
        <audio src={this.props.newOverdub.url} ref={this.newOverdubRef} style={{display: "none"}}/>
        <div ref={this.nowOverdubMeterRef} id="new-overdub-peak-meter" style={{width: "200px", height: "150px"}}></div>
      </span>
    )
  }

  renderControls(){
      const disabled = this.props.playing ? 'disabled' : ''
      return (
        <div className='flex-column'>
          <div className='delete-button' type='button' value='DELETE' onClick={() => this.handleDeleteOverdub(this.props.newOverdub.url)}>x</div>
          <div className='flex overdub-controls-wrapper'>
            <div className={ `overdub-controls-item ${disabled}` }>nudge</div>
            <div className={ `overdub-controls-item ${disabled}` }><input className='video-range' type="range" min="-1" max="1" step="0.01" value={this.props.newOverdub.nudge} onChange={(e) => this.handleNudgeOverdub(this.props.newOverdub, e)} /></div>
            <div className={ `overdub-controls-item ${disabled}` }><input className='video-number' type="number" min="-1" max="1" step="0.01" value={this.props.newOverdub.nudge} onChange={(e) => this.handleNudgeOverdub(this.props.newOverdub, e)} /></div>
          </div>
          <div className='flex overdub-controls-wrapper'>
            <div className={ `overdub-controls-item ${disabled}` }>gain</div>
            <div className={ `overdub-controls-item ${disabled}` }><input className='video-range' type="range" min="0" max="3" step="0.01" value={this.props.newOverdub.gain} onChange={(e) => this.handleGainOverdub(this.props.newOverdub, e)} /></div>
          </div>
          <Button disabled={this.props.playing} name={'UPLOAD'} onClick={this.onUploadClick} />
        </div>
      )
  }

  render() {
    if (this.props.newOverdub.url) {
      return (
        <div className='flex-column new-overdub-wrapper'>
        {this.renderVisuals()}
        {this.renderControls()}
        </div>
      )
    }
  return null
  }
}

OverdubVideo.propTypes = {
  newOverdub: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  playing: PropTypes.bool.isRequired,
  audioContext: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    newOverdub: state.newOverdub,
    actions: state.actions,
    playing: state.player.playing,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      nudgeNewOverdub: bindActionCreators(newOverdubActions.nudgeNewOverdub, dispatch),
      upload: bindActionCreators(newOverdubActions.upload, dispatch),
      removeNewOverdub: bindActionCreators(newOverdubActions.removeNewOverdub, dispatch),
      gainNewOverdub: bindActionCreators(newOverdubActions.gainNewOverdub, dispatch),
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverdubVideo);
