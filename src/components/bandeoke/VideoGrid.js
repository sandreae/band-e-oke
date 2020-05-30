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
  }

  componentDidMount() {
    this.configBackingTrack()
  }

  renderVideoGrid(){
    if (this.props.overdubs.length === 0){
      return null
    }
    return (
      this.props.overdubs.map((overdub, i) => {
        return (
          <div className='flex-column' key={i}>
            <div className='flex videoGridItem'>
              <video key={i} muted src={overdub.url} ref={ref => { this.refsArray[i] = ref}} />
              <div className='delete-button' type='button' id={overdub.id} value='DELETE' onClick={() => this.handleDeleteOverdub(overdub)}>x</div>
            </div>
            <input type="range" min="-1" max="1" step="0.01" value={overdub.nudge} onChange={(e) => this.handleNudgeOverdub(overdub, e)} />
            <input type="number" min="-1" max="1" value={overdub.nudge} onChange={(e) => this.handleNudgeOverdub(overdub, e)} />
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


  render() {
    if (this.props.overdubs.length === 0) {
      return null
    }
    return (
      <div className='flex' wrap='true'>
        {this.renderVideoGrid()}
      </div>
    )
  }
}

VideoGrid.propTypes = {
  overdubs: PropTypes.array.isRequired,
  media: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      deleteOverdub: bindActionCreators(overdubActions.deleteOverdub, dispatch),
      nudgeOverdub: bindActionCreators(overdubActions.nudgeOverdub, dispatch),
      addVideoSyncChildren: bindActionCreators(mediaActions.addVideoSyncChildren, dispatch)
    }
  }
}

export default connect(null, mapDispatchToProps)(VideoGrid);
