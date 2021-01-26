import React, {Component} from "react";
import { Link } from "react-router-dom";
import Login from "../users/Login";
import {connect} from 'react-redux';
import { PropTypes } from "prop-types";
import {logoutUser, loginUser} from '../../redux/actions/userActions';
import * as userApi from "../../api/userApi";

class HomePage extends Component {

  // componentDidMount(){
  //   const token = localStorage.token;
  //   if (token) {
  //     userApi.getProfileFetch(token).then((data)=>{
  //       this.props.loginUser(data.username)
  //     })} else {
  //       this.props.loginUser({})
  //     }
  // }
  //
  renderLogin(){
    if (this.props.currentUser.username) {
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
    if (this.props.currentUser.fetchingUser) {
      return <div></div>
    }
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
  logoutUser: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser
})

const mapDispatchToProps = (dispatch) => {
  return {
    logoutUser: () => dispatch(logoutUser()),
    loginUser: () => dispatch(loginUser())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
