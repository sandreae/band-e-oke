// File holds all of the overdub action creators
import * as types from "./actionTypes";
import * as overdubApi from "../../api/overdubApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

export function loadOverdubsSuccess(overdubs) {
  return { type: types.LOAD_OVERDUBS_SUCCESS, overdubs };
}

export function createOverdubSuccess(overdub) {
  return { type: types.CREATE_OVERDUB_SUCCESS, overdub };
}

export function deleteOverdubOptimistic(overdub) {
  return { type: types.DELETE_OVERDUB_OPTIMISTIC, overdub };
}

export function nudgeOverdub(overdub) {
  return { type: types.NUDGE_OVERDUB, overdub };
}

export function gainOverdub(overdub) {
  return { type: types.GAIN_OVERDUB, overdub };
}

export function saveOverdubs(overdubs) {
  // eslint-disable-next-line no-unused-vars
  return function(dispatch, getState) {
    overdubs.forEach((overdub) => {
      dispatch(beginApiCall());
      overdubApi
      .saveOverdub(overdub)
      .then(savedOverdub => {
        toast.success("Overdub saved.");
        overdub.id
          ? null
          : dispatch(createOverdubSuccess(savedOverdub));
      })
      .catch(error => {
        dispatch(apiCallError(error));
        throw error;
      });
    });
  };
}

export function deleteOverdub(overdub) {
  return function(dispatch) {
    // Doing optimistic delete, so not dispatching begin/end api call
    // actions, or apiCallError action since we're not showing the loading status for this.
    dispatch(deleteOverdubOptimistic(overdub));
    return overdubApi.deleteOverdub(overdub.id)
      .then(() => {
        // dispatch(loadOverdubs())
      });
  };
}
