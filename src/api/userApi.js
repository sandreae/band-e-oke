
const baseUrl = process.env.BASE_URL + "users";

export const userPostFetch = user => {
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
      } else {
        localStorage.setItem("token", data.token)
        // console.log(data)
        // dispatch(loginUser(data.username))
      }
			return data
    })
}

export const userLoginFetch = user => {
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
      } else {
        localStorage.setItem("token", data.token)
        // dispatch(loginUser(data.username))
      }
			return data
    })
}

export const getProfileFetch = (token) => {
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
      }
			return data
    })
}
