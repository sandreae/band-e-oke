// File holds overdub reducer
// Reducers specify how the application's state changes in response to actions sent to the store.
import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function overdubReducer(state = initialState.overdubs, action) {
  switch (action.type) {
    case types.CREATE_OVERDUB_SUCCESS:
      return [...state, { ...action.overdub }];
    case types.UPDATE_OVERDUB_SUCCESS:
      return state.map(overdub =>
        overdub.id === action.overdub.id ? action.overdub : overdub
      );
    case types.LOAD_OVERDUBS_SUCCESS:
      return action.overdubs;
    case types.DELETE_OVERDUB_OPTIMISTIC:
      return state.filter(overdub => overdub.id !== action.overdub.id);
    case types.NUDGE_OVERDUB:
      return state.map(overdub =>
        overdub.id === action.overdub.id ? action.overdub : overdub
      );
    case types.GAIN_OVERDUB:
      return state.map(overdub =>
        overdub.id === action.overdub.id ? action.overdub : overdub
      );
    case types.SET_OVERDUB_BUFFERS:
      return action.overdubs
    default:
      return state;
  }
}
