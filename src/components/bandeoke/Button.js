import React, { Component } from 'react'
import { PropTypes } from "prop-types"

class Button extends Component {

  render() {
    return (
      <div className={ `button ${this.props.disabled ? 'disabled' : ''}` } onClick={(e) => { this.props.onClick(e) }}>
        {this.props.name}
      </div>
    )
  }
}

Button.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
}

export default Button
