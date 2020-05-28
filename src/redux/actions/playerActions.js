import * as types from "./actionTypes";

export function play(result) {
  return { type: types.ALL_MEDIA_PLAYING, result };
}
export function record(result) {
  return { type: types.RECORD_OVERDUB, result };
}
