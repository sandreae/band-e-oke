import * as types from "./actionTypes";

export const loginUser = userObj => ({
    type: types.USER_LOGIN,
    payload: userObj
})

export const logoutUser = () => ({
    type: types.USER_LOGOUT
})

export const fetchingUser = (payload) => ({
    type: types.FETCHING_USER,
    payload: payload
})
