import React, { Component } from 'react'
import { PropTypes } from "prop-types"
import { connect } from "react-redux";
import * as overdubActions from "../../redux/actions/overdubActions";
import { bindActionCreators } from "redux";
import Nexus from "nexusui"

class OverdubControls extends Component {

	constructor(props) {
    super(props)

		this.state = {
			id: Math.random().toString(36),
		};
  }

	componentDidMount(){
    console.log("Overdub mounted")
		let gain = new Nexus.Dial('#gain' + this.state.id,{
			'mode': 'relative',
			'interaction': 'vertical',
			'min': 0,
			'max': 3,
			'step': 0.1,
			'value': this.props.overdub.gain
		})
		gain.colorize("accent","blue")

		let nudge = new Nexus.Slider('#nudge' + this.state.id,{
			'mode': 'relative',
			'min': -0.2,
			'max': 0,
			'step': 0.01,
			'value': this.props.overdub.nudge
		})
		nudge.colorize("accent","blue")
		nudge.colorize("fill","blue")

		var delete_button = new Nexus.TextButton('#delete' + this.state.id,{
			'size': [20,20],
			'text': 'X',
			'mode': 'aftertouch',
			'state': false
		})
		delete_button.colorize("fill","red")

		gain.on('change',this.handleGainOverdub)
		nudge.on('change',this.handleNudgeOverdub)
		delete_button.on('change',this.handleDeleteOverdub)
  }

	handleDeleteOverdub = (v) => {
		this.props.handleDelete(v, this.props.overdub);
  };

  handleNudgeOverdub = (v) => {
    this.props.handleNudge(v, this.props.overdub);
  }

  handleGainOverdub = (v) => {
		this.props.handleGain(v, this.props.overdub);
  };

  render() {
		const disabled = this.props.disabled ? 'disabled' : ''
    return (
			<div className='overdub-controls-wrapper--flex-row'>
				<div className={ `overdub-controls-item ${disabled}` } id={`gain${this.state.id}`}></div>
				<div className={ `overdub-controls-item ${disabled}` } id={`nudge${this.state.id}`}></div>
				<div className={ `overdub-controls-item ${disabled}` }></div>
				<div className={ `overdub-controls-item ${disabled}` } id={`delete${this.state.id}`}></div>
			</div>
    )
  }
}

OverdubControls.propTypes = {
  disabled: PropTypes.bool,
  overdub: PropTypes.object.isRequired,
	handleGain: PropTypes.func.isRequired,
	handleNudge: PropTypes.func.isRequired,
	handleDelete: PropTypes.func.isRequired,
}

export default OverdubControls
