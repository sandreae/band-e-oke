import * as types from "./actionTypes";

export function setTitle(result) {
  return { type: types.META_TITLE, result };
}
