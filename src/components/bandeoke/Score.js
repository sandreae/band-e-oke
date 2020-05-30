
import React, { Component } from 'react';
import OpenSheetMusicDisplay from './OpenSheetMusicDisplay'
import Button from './Button'
import { PropTypes } from "prop-types";
import { toast } from "react-toastify";

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
    toast.success("Score loading.....");
    this.setState(state => state.load = true);
  }

  renderScore() {
    return <OpenSheetMusicDisplay file={this.props.score} tempo={this.props.tempo}/>
  }

  render() {
    if (this.state.load){
      return (
        <div style={{transition: 'all 3000ms', marginLeft: (0 - this.props.scoreOffset)}}>
          {this.renderScore()}
        </div>
      )
    }
    return (
      <div className="Score">
        <Button name="load score" onClick={this.handleClick} />
      </div>
    )
  }
}

Score.propTypes = {
  scoreOffset: PropTypes.number.isRequired,
  score: PropTypes.string.isRequired,
  tempo: PropTypes.string.isRequired,
};

export default Score;
