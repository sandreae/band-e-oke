import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as newOverdubActions from "../../redux/actions/newOverdubActions";
import * as overdubActions from "../../redux/actions/overdubActions";
import { bindActionCreators } from "redux";
import Button from "./Button";
import AudioMeter from "./AudioMeter";
import * as overdubApi from "../../api/overdubApi";

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

  handleNudgeOverdub = (overdub, e) => {
    overdub.nudge = parseFloat(e.target.value)
    this.props.actions.nudgeNewOverdub(overdub)
  }

  onUploadClick = () => {
    this.setState(state => state.uploading = true)
    overdubApi.upload(this.props.newOverdub, this.props.meta.title)
      .then(()=>{
        console.log("UPLOAD COMPLETE")
        overdubApi.loadOverdubs(this.props.audioContext, this.props.songId)
      .then(overdubs=> {
        console.log("OVERDUBS LOADED")
        this.props.actions.loadOverdubsSuccess(overdubs)
        this.props.actions.setOverdubBlob(null, null)
        this.setState(state => state.uploading = false)
      })
    })
    // this.props.actions.upload(this.props.newOverdub)
  }

  handleDeleteOverdub = (url) => {
    this.props.actions.removeNewOverdub(url);
  };

  handleGainOverdub = (overdub, e) => {
    const updatedOverdub = Object.assign({}, overdub);
    updatedOverdub.gain = parseFloat(e.target.value)
    this.props.actions.gainNewOverdub(updatedOverdub);
  };

  render() {
    if (this.props.newOverdub.buffer) {
      return (
        <div className='overdub-wrapper'>
          <div className='overdub-item-wrapper'>
            <div className='overdub-item audio-meter'><AudioMeter overdub={this.props.newOverdub} playing={this.props.playing} audioContext={this.props.audioContext}/></div>
            <div className={ `overdub-item ${this.state.uploading ? 'disabled' : ''}` } onClick={(e) => { this.onUploadClick(e) }}>SAVE</div>
            <div className='overdub-item' type='button' value='DELETE' onClick={() => this.handleDeleteOverdub(this.props.newOverdub.url)}>DELETE</div>
            <input className='overdub-item' type="number" min="0" max="0.2" step="0.01" value={this.props.newOverdub.nudge} onChange={(e) => this.handleNudgeOverdub(this.props.newOverdub, e)} />
            <input className='overdub-item' type="range" min="0" max="0.2" step="0.01" value={this.props.newOverdub.nudge} onChange={(e) => this.handleNudgeOverdub(this.props.newOverdub, e)} />
            <input className='overdub-item' type="range" min="0" max="3" step="0.01" value={this.props.newOverdub.gain} onChange={(e) => this.handleGainOverdub(this.props.newOverdub, e)} />
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
