// File holds item reducer
// Reducers specify how the application's state changes in response to actions sent to the store.
import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function reducer(state = initialState, action) {
    switch (action.type) {
      case types.USER_LOGIN:
        return {...state, currentUser: action.payload}
      case types.USER_LOGOUT:
        return {...state, currentUser: null }
      default:
        return state;
    }
  }
