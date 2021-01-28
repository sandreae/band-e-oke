import React, {Component} from "react";
import { Link } from "react-router-dom";
import Login from "../users/Login";
import {connect} from 'react-redux';
import { PropTypes } from "prop-types";
import {logoutUser, loginUser} from '../../redux/actions/userActions';
import * as userApi from "../../api/userApi";
import Button from "../bandeoke/Button"

class HomePage extends Component {

  componentDidMount(){
    console.log("HOME mounted")
    console.log(this.props.songs)
  }

  renderLogin(){
    if (this.props.currentUser.username) {
      return <Button name="Logout" onClick={() => { this.handleClick() }} />
    }
    return <Login/>
  }

  handleClick = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token")
    // Remove the user object from the Redux store
    this.props.logoutUser()
  }

  renderSongs(){
    if (this.props.currentUser.username){
      return (<ul>
      {this.props.songs.map((song, i) => {
        return <li key={i}><Link to={`/scores${song.path}`}>{song.title}</Link></li>
      })}
      </ul>
    )}
  }

  render() {
    if (this.props.currentUser.fetchingUser) {
      return <div></div>
    }
    return (
      <div className="home-page--flex-column">
        <div><h1>Band-e-oke</h1></div>
        {this.renderSongs()}
        {this.renderLogin()}
      </div>
    )
  }
}

HomePage.propTypes = {
  currentUser: PropTypes.object,
  logoutUser: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  songs: PropTypes.array,
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
