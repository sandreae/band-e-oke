export const CREATE_OVERDUB = "CREATE_OVERDUB";
export const LOAD_OVERDUBS_SUCCESS = "LOAD_OVERDUBS_SUCCESS";
export const LOAD_USERS_SUCCESS = "LOAD_USERS_SUCCESS";
export const UPDATE_OVERDUB_SUCCESS = "UPDATE_OVERDUB_SUCCESS";
export const CREATE_OVERDUB_SUCCESS = "CREATE_OVERDUB_SUCCESS";
export const NUDGE_OVERDUB = "NUDGE_OVERDUB"
export const SET_OVERDUB_BUFFERS = "SET_OVERDUB_BUFFERS"
export const GAIN_OVERDUB = "GAIN_OVERDUB"

export const BEGIN_API_CALL = "BEGIN_API_CALL";
export const API_CALL_ERROR = "API_CALL_ERROR";

// By convention, actions that end in "_SUCCESS" are assumed to have been the result of a completed
// API call. But since we're doing an optimistic delete, we're hiding loading state.
// So this action name deliberately omits the "_SUCCESS" suffix.
// If it had one, our apiCallsInProgress counter would be decremented below zero
// because we're not incrementing the number of apiCallInProgress when the delete request begins.
export const DELETE_OVERDUB_OPTIMISTIC = "DELETE_OVERDUB_OPTIMISTIC";

export const OFFSET_SCORE = "OFFSET_SCORE";
export const SCORE_STATUS = "SCORE_STATUS";
export const STREAM_STATUS = "STREAM_STATUS";

export const SET_BACKINGTRACK_BUFFER = "SET_BACKINGTRACK_BUFFER";

export const SET_OVERDUB_BLOB = "SET_OVERDUB_BLOB";
export const NUDGE_NEW_OVERDUB = "NUDGE_NEW_OVERDUB";
export const SET_NEW_OVERDUB_BUFFER = "SET_NEW_OVERDUB_BUFFER";
export const REMOVE_NEW_OVERDUB = "REMOVE_NEW_OVERDUB";
export const GAIN_NEW_OVERDUB = "GAIN_NEW_OVERDUB";

export const ALL_MEDIA_PLAYING = "ALL_MEDIA_PLAYING"
export const RECORD_OVERDUB = "RECORD_OVERDUB"

export const META_TITLE = "META_TITLE"

export const USER_LOGIN = "USER_LOGIN"
export const USER_LOGOUT = "USER_LOGOUT"
export const FETCHING_USER = "FETCHING_USER"
