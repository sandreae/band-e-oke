/* eslint-disable no-unused-expressions */

// Overdub template page using a class
import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import * as overdubActions from "../../redux/actions/overdubActions";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";
import AudioMeter from "./AudioMeter";

class Overdubs extends React.Component {

  constructor(props) {
    super(props)
    this.refsArray = []

    this.handleDeleteOverdub = this.handleDeleteOverdub.bind(this);
    this.handleNudgeOverdub = this.handleNudgeOverdub.bind(this);
    this.handleGainOverdub = this.handleGainOverdub.bind(this);
  }

  componentDidMount(){
    console.log("Overdub mounted")
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
    if (isNaN(e.target.value)) {
      console.log("Not a number")
      return
    }
    const updatedOverdub = Object.assign({}, overdub);
    updatedOverdub.nudge = parseFloat(e.target.value)
    this.props.actions.nudgeOverdub(updatedOverdub);
  }

  handleGainOverdub = (overdub, e) => {
    const updatedOverdub = Object.assign({}, overdub);
    updatedOverdub.gain = parseFloat(e.target.value)
    this.props.actions.gainOverdub(updatedOverdub);
  };

  renderOverdubs(){
    const disabled = this.props.disabled ? 'disabled' : ''
    if (this.props.overdubs.length === 0){
      return null
    }
    return (
      this.props.overdubs.map((overdub, i) => {
        return (
          <div className='flex-column video-grid-item-wrapper' key={i}>
            <div className='flex video-grid-item'>
              <AudioMeter key={i} overdub={overdub} playing={this.props.playing} audioContext={this.props.audioContext} isAudioBufferUrl={false}/>
              <div className='flex overdub-upper-controls'>
                <div className={ `delete-button ${disabled}` } id={overdub.id} value='DELETE' onClick={() => this.handleDeleteOverdub(overdub)}>x</div>
              </div>
            </div>
            <div className='flex overdub-controls-wrapper'>
              <div className={ `overdub-controls-item ${disabled}` }><input className='video-number-nudge' type="string" min="0" max="0.2" step="0.01" value={overdub.nudge} onChange={(e) => this.handleNudgeOverdub(overdub, e)} onBlur={(e) => this.handleRefresh(overdub, e)} /></div>
              <div className={ `overdub-controls-item ${disabled}` }><input className='video-range-nudge' type="range" min="0" max="0.2" step="0.01" value={overdub.nudge} onChange={(e) => this.handleNudgeOverdub(overdub, e)} onMouseUp={(e) => this.handleRefresh(overdub, e)}/></div>
              <div className={ `overdub-controls-item ${disabled}` }><input className='video-range-gain' type="range" min="0" max="3" step="0.01" orient="vertical" value={overdub.gain} onChange={(e) => this.handleGainOverdub(overdub, e)}/></div>
            </div>
          </div>
        )
      })
    )
  }

  render() {
    if (this.props.overdubs.length === 0) {
      return null
    }
    return (
      <div className='video-grid-wrapper flex' wrap='true'>
        {this.renderOverdubs()}
      </div>
    )
  }
}

Overdubs.propTypes = {
  actions: PropTypes.object.isRequired,
  audioContext: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  overdubs: PropTypes.array.isRequired,
  playing: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      deleteOverdub: bindActionCreators(overdubActions.deleteOverdub, dispatch),
      gainOverdub: bindActionCreators(overdubActions.gainOverdub, dispatch),
      nudgeOverdub: bindActionCreators(overdubActions.nudgeOverdub, dispatch),
    }
  }
}

export default connect(null, mapDispatchToProps)(Overdubs);
