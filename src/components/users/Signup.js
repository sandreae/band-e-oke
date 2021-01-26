import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as userApi from "../../api/userApi";
import { PropTypes } from "prop-types";

class Signup extends Component {
  state = {
    username: "",
    password: "",
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault()
    userApi.userPostFetch(this.state)
  }

  render() {
    return (
      <div className="flex-column signup">
      <form onSubmit={this.handleSubmit}>
        <h1>Create a Bandeoke Account</h1>

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

        <input type='submit' value='signup'/>
      </form>
      </div>
    )
  }
}

export default connect(null, null)(Signup);
