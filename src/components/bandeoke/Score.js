
import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import OpenSheetMusicDisplay from './OpenSheetMusicDisplay'
import Button from './Button'

class Score extends Component {

  renderMessage() {
    if (this.props.media.scoreStatus === 'loading') {
      return <div>Score loading.....</div>
    }
    return null
  }

  renderScore() {
    return <OpenSheetMusicDisplay file={this.props.score} tempo={this.props.tempo}/>
  }

  render() {
    return (
      <div style={{transition: 'all 3000ms', marginLeft: (0 - this.props.scoreOffset)}}>
        {this.renderMessage()}
        {this.renderScore()}
      </div>
    )
  }
}

Score.propTypes = {
  scoreOffset: PropTypes.number.isRequired,
  score: PropTypes.string.isRequired,
  tempo: PropTypes.string.isRequired,
  media: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    media: state.media,
  };
}

export default connect(mapStateToProps, null)(Score);
