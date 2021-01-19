/* eslint-disable no-unused-expressions */

// Overdub template page using a class
import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import * as overdubActions from "../../redux/actions/overdubActions";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";
import AudioMeter from "./AudioMeter";

class VideoGrid extends React.Component {

  constructor(props) {
    super(props)
    this.refsArray = []

    this.handleDeleteOverdub = this.handleDeleteOverdub.bind(this);
    this.handleNudgeOverdub = this.handleNudgeOverdub.bind(this);
    this.handleGainOverdub = this.handleGainOverdub.bind(this);
  }

  handleDeleteOverdub = async overdub => {
    toast.success("Overdub Deleted");
    try {
      this.props.actions.deleteOverdub(overdub);
    } catch (error) {
      toast.error("Delete Failed " + error.message, { autoClose: false });
    }
  };

  handleNudgeOverdub = (overdub, e) => {
    const updatedOverdub = Object.assign({}, overdub);
    updatedOverdub.nudge = parseFloat(e.target.value)
    this.props.actions.nudgeOverdub(updatedOverdub);
  }

  handleGainOverdub = (overdub, e) => {
    const updatedOverdub = Object.assign({}, overdub);
    updatedOverdub.gain = parseFloat(e.target.value)
    this.props.actions.gainOverdub(updatedOverdub);
  };

  renderOverdubItem(i){
    let nodes = this.props.overdubNodes
    if (this.props.video) {
      return <video key={i} muted src={this.props.overdubs[i].url} ref={ref => { this.refsArray[i] = ref}} />
    } else {
      return <AudioMeter key={i} audioNode={nodes[i] ? nodes[i].source : {}} playing={this.props.playing} audioContext={this.props.audioContext} isAudioBufferUrl={false}/>
    }
  }

  renderVideoGrid(){
    const disabled = this.props.disabled ? 'disabled' : ''
    if (this.props.overdubs.length === 0){
      return null
    }
    return (
      this.props.overdubs.map((overdub, i) => {
        return (
          <div className='flex-column video-grid-item-wrapper' key={i}>
            <div className='flex video-grid-item'>
              {this.renderOverdubItem(i)}
              <div className={ `delete-button ${disabled}` } id={overdub.id} value='DELETE' onClick={() => this.handleDeleteOverdub(overdub)}>x</div>
            </div>
            <div className='flex overdub-controls-wrapper'>
              <div className={ `overdub-controls-item nudge ${disabled}` }>nudge</div>
              <div className={ `overdub-controls-item nudge ${disabled}` }><input className='video-range' type="range" min="-1" max="1" step="0.01" value={overdub.nudge} onChange={(e) => this.handleNudgeOverdub(overdub, e)} /></div>
              <div className={ `overdub-controls-item nudge ${disabled}` }><input className='video-number' type="number" min="-1" max="1" step="0.01" value={overdub.nudge} onChange={(e) => this.handleNudgeOverdub(overdub, e)} /></div>
            </div>
            <div className='flex overdub-controls-wrapper'>
              <div className={ `overdub-controls-item gain ${disabled}` }>gain</div>
              <div className={ `overdub-controls-item gain ${disabled}` }><input className='video-range' type="range" min="0" max="3" step="0.01" value={overdub.gain} onChange={(e) => this.handleGainOverdub(overdub, e)} /></div>
            </div>
          </div>
        )
      })
    )
  }

  render() {
    if (this.props.overdubs.length === 0 || this.props.overdubNodes.length === 0) {
      return null
    }
    return (
      <div className='video-grid-wrapper flex' wrap='true'>
        {this.renderVideoGrid()}
      </div>
    )
  }
}

VideoGrid.propTypes = {
  overdubNodes: PropTypes.array.isRequired,
  overdubs: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  audioContext: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  playing: PropTypes.bool.isRequired,
  video: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      deleteOverdub: bindActionCreators(overdubActions.deleteOverdub, dispatch),
      nudgeOverdub: bindActionCreators(overdubActions.nudgeOverdub, dispatch),
      gainOverdub: bindActionCreators(overdubActions.gainOverdub, dispatch)
    }
  }
}

export default connect(null, mapDispatchToProps)(VideoGrid);
