
import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import OpenSheetMusicDisplay from './OpenSheetMusicDisplay'
import Button from './Button'

class Score extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      load: false
    };

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.setState(state => state.load = true);
  }

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

    if (this.state.load){
      return (
        <div style={{transition: 'all 3000ms', marginLeft: (0 - this.props.scoreOffset)}}>
          {this.renderMessage()}
          {this.renderScore()}
        </div>
      )
    }
    return (
      <div className="Score">
        <Button disabled={this.props.playing} name="load score" onClick={this.handleClick} />
      </div>
    )
  }
}

Score.propTypes = {
  scoreOffset: PropTypes.number.isRequired,
  score: PropTypes.string.isRequired,
  tempo: PropTypes.string.isRequired,
  media: PropTypes.object.isRequired,
  playing: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    media: state.media,
    playing: state.player.playing,
  };
}

export default connect(mapStateToProps, null)(Score);
