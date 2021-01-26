// File holds item reducer
// Reducers specify how the application's state changes in response to actions sent to the store.
import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function reducer(state = initialState.currentUser, action) {
    switch (action.type) {
      case types.USER_LOGIN:
        return {...state, ...{
          username: action.payload,
          fetchingUser: false}
        }
      case types.FETCHING_USER:
        return {...state, ...{fetchingUser: action.payload}}
      case types.USER_LOGOUT:
        return {...state, ...{
          username: null,
        }
      }
      default:
        return state;
    }
  }
