/* eslint-disable no-unused-expressions */

// Overdub template page using a class
import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import * as overdubActions from "../../redux/actions/overdubActions";
import * as mediaActions from "../../redux/actions/mediaActions";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";

class VideoGrid extends React.Component {

  constructor(props) {
    super(props)
    this.refsArray = []

    this.handleDeleteOverdub = this.handleDeleteOverdub.bind(this);
    this.handleNudgeOverdub = this.handleNudgeOverdub.bind(this);
    this.handleGainOverdub = this.handleGainOverdub.bind(this);
  }

  componentDidMount() {
    this.configBackingTrack()
  }

  componentDidUpdate(prevProps) {
    if(this.props.overdubs.length > prevProps.overdubs.length){
      this.configBackingTrack()
    }
    console.log(this.props.disabled)
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
              <video key={i} muted src={overdub.url} ref={ref => { this.refsArray[i] = ref}} />
              <div className={ `delete-button ${disabled}` } id={overdub.id} value='DELETE' onClick={() => this.handleDeleteOverdub(overdub)}>x</div>
            </div>
            <div className='flex overdub-controls-wrapper'>
              <div className={ `overdub-controls-item ${disabled}` }>nudge</div>
              <div className={ `overdub-controls-item ${disabled}` }><input className='video-range' type="range" min="-1" max="1" step="0.01" value={overdub.nudge} onChange={(e) => this.handleNudgeOverdub(overdub, e)} /></div>
              <div className={ `overdub-controls-item ${disabled}` }><input className='video-number' type="number" min="-1" max="1" step="0.01" value={overdub.nudge} onChange={(e) => this.handleNudgeOverdub(overdub, e)} /></div>
            </div>
            <div className='flex overdub-controls-wrapper'>
              <div className={ `overdub-controls-item ${disabled}` }>gain</div>
              <div className={ `overdub-controls-item ${disabled}` }><input className='video-range' type="range" min="0" max="3" step="0.01" value={overdub.gain} onChange={(e) => this.handleGainOverdub(overdub, e)} /></div>
            </div>
          </div>
        )
      })
    )
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
    overdub.nudge = parseFloat(e.target.value)
    this.props.actions.nudgeOverdub(overdub)
  }

  configBackingTrack = () => {
    if(this.props.media.videoSyncSet && this.refsArray.length !== 0){
      this.props.actions.addVideoSyncChildren(this.refsArray)
    }
  }

  handleGainOverdub = (overdub, e) => {
    overdub.gain = parseFloat(e.target.value)
    this.props.actions.gainOverdub(overdub);
  };

  render() {
    if (this.props.overdubs.length === 0) {
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
  overdubs: PropTypes.array.isRequired,
  media: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    disabled: state.player.playing,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      deleteOverdub: bindActionCreators(overdubActions.deleteOverdub, dispatch),
      nudgeOverdub: bindActionCreators(overdubActions.nudgeOverdub, dispatch),
      addVideoSyncChildren: bindActionCreators(mediaActions.addVideoSyncChildren, dispatch),
      gainOverdub: bindActionCreators(overdubActions.gainOverdub, dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoGrid);
