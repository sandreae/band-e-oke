/* eslint-disable no-unused-expressions */

// Overdub template page using a class
import React from "react";
import { PropTypes } from "prop-types";
import AudioMeter from "./AudioMeter";
import OverdubControls from "./OverdubControls";

class Overdubs extends React.Component {

  renderOverdubs(){
    if (this.props.overdubs.length === 0){
      return null
    }
    return (
      this.props.overdubs.map((overdub, i) => {
        return (
          <div className='overdub-item-wrapper--flex-column' key={i}>
            <AudioMeter key={i} overdub={overdub} playing={this.props.playing} audioContext={this.props.audioContext} isAudioBufferUrl={false}/>
            <OverdubControls overdub={overdub} disabled={this.props.disabled}/>
          </div>
        )
      })
    )
  }
  // <input className={ `overdub-item ${disabled}` } type="range" min="0" max="3" step="0.01" orient="vertical" value={overdub.gain} onChange={(e) => this.handleGainOverdub(overdub, e)}/>
  // <div className={ `overdub-item delete-button ${disabled}` } id={overdub.id} value='DELETE' onClick={() => this.handleDeleteOverdub(overdub)}>x</div>
  // <input className={ `overdub-item ${disabled}` } type="string" min="0" max="0.2" step="0.01" value={overdub.nudge} onChange={(e) => this.handleNudgeOverdub(overdub, e)} onBlur={(e) => this.handleRefresh(overdub, e)} />
  // <input className={ `overdub-item ${disabled}` } type="range" min="0" max="0.2" step="0.01" value={overdub.nudge} onChange={(e) => this.handleNudgeOverdub(overdub, e)} onMouseUp={(e) => this.handleRefresh(overdub, e)}/>

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

export default Overdubs
