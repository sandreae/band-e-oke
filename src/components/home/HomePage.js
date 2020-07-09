import React, {Component} from "react";
import { Link } from "react-router-dom";
import Login from "../users/Login";
import {connect} from 'react-redux';
import { PropTypes } from "prop-types";
import Button from '../bandeoke/Button'
import {getProfileFetch, logoutUser} from '../../redux/actions/userActions';

class HomePage extends Component {

  renderLogin(){
    if (this.props.currentUser.currentUser) {
      return <div className="button-small" onClick={(e) => { this.handleClick(e) }}>logout</div>
    }
    return <Login/>
  }

  handleClick = event => {
    event.preventDefault()
    // Remove the token from localStorage
    localStorage.removeItem("token")
    // Remove the user object from the Redux store
    this.props.logoutUser()
  }

  render() {
    return (
      <div className="flex-column">
      <div className="flex home-page">
        <div><h1>Band-e-oke</h1></div>
        <div className="how-to-link-wrapper"><Link to="/how-to">How to...</Link></div>
      </div>
      {this.renderLogin()}
      </div>
    )
  }
}

HomePage.propTypes = {
  currentUser: PropTypes.object,
  getProfileFetch: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser
})

const mapDispatchToProps = dispatch => ({
  getProfileFetch: () => dispatch(getProfileFetch()),
  logoutUser: () => dispatch(logoutUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
