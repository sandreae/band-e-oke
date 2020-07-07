const baseUrl = process.env.API_URL + "users";
import * as types from "./actionTypes";

export const userPostFetch = user => {
  return dispatch => {
    return fetch(baseUrl, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        "username": user.username,
        "password": user.password
      })
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.message) {
          console.log('Error')
          console.log(data)
          // Here you should have logic to handle invalid creation of a user.
          // This assumes your Rails API will return a JSON object with a key of
          // 'message' if there is an error with creating the user, i.e. invalid username
        } else {
          localStorage.setItem("token", data.token)
          console.log(data)
          dispatch(loginUser(data.username))
        }
      })
  }
}

export const userLoginFetch = user => {
  return dispatch => {
    return fetch(baseUrl +"/login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        "username": user.username,
        "password": user.password
      })
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.message) {
          // Here you should have logic to handle invalid login credentials.
          // This assumes your Rails API will return a JSON object with a key of
          // 'message' if there is an error
        } else {
          localStorage.setItem("token", data.token)
          dispatch(loginUser(data.username))
        }
      })
  }
}

export const getProfileFetch = () => {
  return dispatch => {
    const token = localStorage.token;
    if (token) {
      return fetch(baseUrl +"/get", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
          Accept: 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(resp => resp.json())
        .then(data => {
          if (data.message) {
            // An error will occur if the token is invalid.
            // If this happens, you may want to remove the invalid token.
            localStorage.removeItem("token")
          } else {
            dispatch(loginUser(data.username))
          }
        })
    }
  }
}

const loginUser = userObj => ({
    type: types.USER_LOGIN,
    payload: userObj
})

export const logoutUser = () => ({
  type: types.USER_LOGOUT
})
