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

  renderVideo(){
    if (this.props.newOverdub.url) {
      return (
        <div className='flex-column'>
          <video muted src={this.props.newOverdub.url} ref={this.myRef}/>
          <input type="range" min="-1" max="1" step="0.01" value={this.props.newOverdub.nudge} onChange={(e) => this.handleNudgeOverdub(this.props.newOverdub, e)} />
          <input type="number" min="-1" max="1" value={this.props.newOverdub.nudge} onChange={(e) => this.handleNudgeOverdub(this.props.newOverdub, e)} />
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverdubVideo);
