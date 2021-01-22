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
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default Button
