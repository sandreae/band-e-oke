/* eslint-disable no-unused-expressions */

// Overdub template page using a class
import React from "react";
import { PropTypes } from "prop-types";
import AudioMeter from "./AudioMeter";
import OverdubControls from "./OverdubControls";
import { connect } from "react-redux";
import * as overdubActions from "../../redux/actions/overdubActions";
import { bindActionCreators } from "redux";

class Overdubs extends React.Component {

  handleDeleteOverdub = (v, overdub) => {
		if (!v.state){
			this.props.actions.deleteOverdub(overdub);
		}
  };

  handleNudgeOverdub = (v, overdub) => {
    if (isNaN(v)) {
      console.log("Not a number")
      return
    }
    const updatedOverdub = Object.assign({}, overdub);
    updatedOverdub.nudge = parseFloat(v) * -1
    this.props.actions.nudgeOverdub(updatedOverdub);
  }

  handleGainOverdub = (v, overdub) => {
    const updatedOverdub = Object.assign({}, overdub);
    updatedOverdub.gain = parseFloat(v)
    this.props.actions.gainOverdub(updatedOverdub);
  };

  renderOverdubs(){
    if (this.props.overdubs.length === 0){
      return null
    }
    return (
      this.props.overdubs.map((overdub, i) => {
        return (
          <div className='overdub-item-wrapper--flex-column' key={i}>
            <AudioMeter
              key={i}
              overdub={overdub}
              playing={this.props.playing}
              audioContext={this.props.audioContext}
              isAudioBufferUrl={false}
              type="oscilloscope"
              />
            <OverdubControls
              overdub={overdub}
              disabled={this.props.disabled}
              handleNudge={this.handleNudgeOverdub}
              handleGain={this.handleGainOverdub}
              handleDelete={this.handleDeleteOverdub}
            />
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
      <div className='overdubs-wrapper flex-column'>
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
