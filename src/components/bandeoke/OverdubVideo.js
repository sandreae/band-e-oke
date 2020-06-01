import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as mediaActions from "../../redux/actions/mediaActions";
import * as newOverdubActions from "../../redux/actions/newOverdubActions";
import { bindActionCreators } from "redux";
import Button from "./Button";

class OverdubVideo extends Component {

  constructor(props) {
    super(props)
    this.myRef = React.createRef()

    this.handleNudgeOverdub = this.handleNudgeOverdub.bind(this);
    this.handleDeleteOverdub = this.handleDeleteOverdub.bind(this);
    this.handleGainOverdub = this.handleGainOverdub.bind(this);
  }

  componentDidUpdate(prevProps) {
    if(this.props.newOverdub.url && (this.props.newOverdub.url !== prevProps.newOverdub.url)){
      this.props.actions.addVideoSyncChildren([this.myRef.current])
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

  renderVideo(){
    if (this.props.newOverdub.url) {
      return (
        <div className='flex-column new-overdub-wrapper'>
          <video muted src={this.props.newOverdub.url} ref={this.myRef}/>
          <div className='delete-button' type='button' value='DELETE' onClick={() => this.handleDeleteOverdub(this.props.newOverdub.url)}>x</div>
          <input className='video-range' type="range" min="-1" max="1" step="0.01" value={this.props.newOverdub.nudge} onChange={(e) => this.handleNudgeOverdub(this.props.newOverdub, e)} />
          <input className='video-input' type="number" min="-1" max="1" value={this.props.newOverdub.nudge} onChange={(e) => this.handleNudgeOverdub(this.props.newOverdub, e)} />
          <input className='video-range' type="range" min="0" max="3" step="0.01" value={this.props.newOverdub.gain} onChange={(e) => this.handleGainOverdub(this.props.newOverdub, e)} />
          <Button disabled={this.props.playing} name={'UPLOAD'} onClick={this.onUploadClick} />
        </div>
      )
    }
    return null
  }

  render() {
    return <div className='flex' width='200px'>
      {this.renderVideo()}
    </div>
  }
}

OverdubVideo.propTypes = {
  newOverdub: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  playing: PropTypes.bool.isRequired,
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
      addVideoSyncChildren: bindActionCreators(mediaActions.addVideoSyncChildren, dispatch),
      nudgeNewOverdub: bindActionCreators(newOverdubActions.nudgeNewOverdub, dispatch),
      upload: bindActionCreators(newOverdubActions.upload, dispatch),
      removeNewOverdub: bindActionCreators(newOverdubActions.removeNewOverdub, dispatch),
      gainNewOverdub: bindActionCreators(newOverdubActions.gainNewOverdub, dispatch),
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverdubVideo);
