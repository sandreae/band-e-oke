import React, {Component} from 'react';
import {connect} from 'react-redux';
import {userLoginFetch} from "../../redux/actions/userActions";
import { PropTypes } from "prop-types";

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

  handleSubmit = event => {
    event.preventDefault()
    this.props.userLoginFetch(this.state)
  }

  render() {
    return (
      <div className="flex-column login">
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

        <input type='submit' name='login' value='login'/>
      </form>
      </div>
    )
  }
}

Login.propTypes = {
  userLoginFetch: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
  userLoginFetch: userInfo => dispatch(userLoginFetch(userInfo))
})

const mapStateToProps = state => ({
  currentUser: state.currentUser
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
