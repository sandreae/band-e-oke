import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function metaReducer(state = initialState.meta, action) {
  switch (action.type) {
    case types.META_TITLE:
    return Object.assign({}, state, {
       title: action.result
    })
    default:
      return state;
  }
}
