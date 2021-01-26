import React, {Component} from 'react';
import {connect} from 'react-redux';
import { PropTypes } from "prop-types";
import {logoutUser, loginUser} from '../../redux/actions/userActions';
import * as userApi from "../../api/userApi";
import Button from "../bandeoke/Button"

class Login extends Component {
  state = {
    username: "",
    password: ""
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = () => {
    userApi.userLoginFetch(this.state).then(data =>{
      console.log(data)
      this.props.loginUser(data.username)
    })
  }

  render() {
    return (
      <div className="login--flex-column">
        <form onSubmit={this.handleSubmit}>
          <label>Username</label>
          <input
            name='username'
            placeholder='Username'
            value={this.state.username}
            onChange={this.handleChange}
            /><br/>

          <label>Password</label>
          <input
            type='password'
            name='password'
            placeholder='Password'
            value={this.state.password}
            onChange={this.handleChange}
            /><br/>

        </form>
        <Button name="Login" onClick={() => this.handleSubmit()} />
      </div>
    )
  }
}

Login.propTypes = {
  currentUser: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.currentUser
})

const mapDispatchToProps = (dispatch) => {
  return {
    logoutUser: () => dispatch(logoutUser()),
    loginUser: (username) => dispatch(loginUser(username))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
