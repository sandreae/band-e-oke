import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as newOverdubActions from "../../redux/actions/newOverdubActions";
import * as overdubActions from "../../redux/actions/overdubActions";
import { bindActionCreators } from "redux";
import OverdubControls from "./OverdubControls";
import AudioMeter from "./AudioMeter";

class NewOverdubItem extends Component {

  constructor(props) {
    super(props)

    this.handleNudgeOverdub = this.handleNudgeOverdub.bind(this);
    this.handleDeleteOverdub = this.handleDeleteOverdub.bind(this);
    this.handleGainOverdub = this.handleGainOverdub.bind(this);

    this.state = {
      uploading: false,
    };
  }

  handleNudgeOverdub = (v, newOverdub) => {
    newOverdub.nudge = parseFloat(v) * -1
    this.props.actions.nudgeNewOverdub(newOverdub)
  }

  handleDeleteOverdub = (v, newOverdub) => {
    this.props.actions.removeNewOverdub(newOverdub.url);
  };

  handleGainOverdub = (v, newOverdub) => {
    const updatedOverdub = Object.assign({}, newOverdub);
    updatedOverdub.gain = parseFloat(v)
    this.props.actions.gainNewOverdub(updatedOverdub);
  };

  render() {
    if (this.props.newOverdub.buffer) {
      return (
        <div className='new-overdub-wrapper--flex-column'>
          <div className='overdub-item-wrapper--flex-column new-overdub'>
            <AudioMeter
              overdub={this.props.newOverdub}
              playing={this.props.playing}
              audioContext={this.props.audioContext}
              isAudioBufferUrl={false}
              type="oscilloscope"
            />
            <OverdubControls
              overdub={this.props.newOverdub}
              disabled={this.props.disabled}
              handleNudge={this.handleNudgeOverdub}
              handleGain={this.handleGainOverdub}
              handleDelete={this.handleDeleteOverdub}
              newOverdub={true}
            />
          </div>
        </div>
      )
    }
  return null
  }
}

NewOverdubItem.propTypes = {
  actions: PropTypes.object.isRequired,
  audioContext: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  newOverdub: PropTypes.object.isRequired,
  playing: PropTypes.bool.isRequired,
  songId: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    actions: state.actions,
    meta: state.meta,
    newOverdub: state.newOverdub,
    playing: state.player.playing,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      gainNewOverdub: bindActionCreators(newOverdubActions.gainNewOverdub, dispatch),
      loadOverdubsSuccess: bindActionCreators(overdubActions.loadOverdubsSuccess, dispatch),
      nudgeNewOverdub: bindActionCreators(newOverdubActions.nudgeNewOverdub, dispatch),
      removeNewOverdub: bindActionCreators(newOverdubActions.removeNewOverdub, dispatch),
      setOverdubBlob: bindActionCreators(newOverdubActions.setOverdubBlob, dispatch),
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewOverdubItem);
