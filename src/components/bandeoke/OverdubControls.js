import React, { Component } from 'react'
import { PropTypes } from "prop-types"
import { connect } from "react-redux";
import * as overdubActions from "../../redux/actions/overdubActions";
import { bindActionCreators } from "redux";
import Nexus from "nexusui"

class OverdubControls extends Component {

	constructor(props) {
    super(props)

    this.handleDeleteOverdub = this.handleDeleteOverdub.bind(this);
    this.handleNudgeOverdub = this.handleNudgeOverdub.bind(this);
    this.handleGainOverdub = this.handleGainOverdub.bind(this);
  }

	componentDidMount(){
    console.log("Overdub mounted")
		let gain = new Nexus.Slider('#gain' + this.props.overdub.id,{
			'mode': 'relative',
			'min': 0,
			'max': 3,
			'step': 0.1,
			'value': this.props.overdub.gain
		})
		let nudge = new Nexus.Number('#nudge' + this.props.overdub.id,{
			'mode': 'relative',
			'min': 0,
			'max': 0.2,
			'step': 0.01,
			'value': this.props.overdub.nudge
		})
		var delete_button = new Nexus.TextButton('#delete' + this.props.overdub.id,{
			'size': [20,20],
			'text': 'X',
			'mode': 'aftertouch',
			'state': false
		})
		gain.on('change',this.handleGainOverdub)
		nudge.on('change',this.handleNudgeOverdub)
		delete_button.on('change',this.handleDeleteOverdub)
  }

	handleDeleteOverdub = (v) => {
		if (!v.state){
			this.props.actions.deleteOverdub(this.props.overdub);
		}
  };

  handleNudgeOverdub = (v) => {
    if (isNaN(v)) {
      console.log("Not a number")
      return
    }
    const updatedOverdub = Object.assign({}, this.props.overdub);
    updatedOverdub.nudge = parseFloat(v)
    this.props.actions.nudgeOverdub(updatedOverdub);
  }

  handleGainOverdub = (v) => {
    const updatedOverdub = Object.assign({}, this.props.overdub);
    updatedOverdub.gain = parseFloat(v)
    this.props.actions.gainOverdub(updatedOverdub);
  };

  render() {
		const disabled = this.props.disabled ? 'disabled' : ''
    return (
			<div className='overdub-controls-wrapper--flex-column'>
				<div className={ `overdub-controls-item ${disabled}` } id={`gain${this.props.overdub.id}`}></div>
				<div className={ `overdub-controls-item ${disabled}` } id={`delete${this.props.overdub.id}`}></div>
				<div className={ `overdub-controls-item ${disabled}` }></div>
				<div className={ `overdub-controls-item ${disabled}` } id={`nudge${this.props.overdub.id}`}></div>
			</div>
    )
  }
}

OverdubControls.propTypes = {
  disabled: PropTypes.bool,
  overdub: PropTypes.func.isRequired,
	actions: PropTypes.object.isRequired,
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      deleteOverdub: bindActionCreators(overdubActions.deleteOverdub, dispatch),
      gainOverdub: bindActionCreators(overdubActions.gainOverdub, dispatch),
      nudgeOverdub: bindActionCreators(overdubActions.nudgeOverdub, dispatch),
    }
  }
}

export default connect(null, mapDispatchToProps)(OverdubControls);
