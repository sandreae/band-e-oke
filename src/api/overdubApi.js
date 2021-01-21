import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.API_URL + "overdubs/";

export function getOverdubs() {
  const token = localStorage.token;
  return fetch(baseUrl, {
    headers: { "x-access-token": token },
  })
    .then(handleResponse)
    .catch(handleError);
}

export function getOverdubsByTitle(title) {
  const token = localStorage.token;
  return fetch(baseUrl + 'title/' + title, {
    headers: { "x-access-token": token },
  })
    .then(handleResponse)
    .catch(handleError);
}

export function saveOverdub(overdub) {
  const token = localStorage.token;
  return fetch(baseUrl + (overdub.id || ""), {
    method: overdub.id ? "PUT" : "POST", // POST for create, PUT to update when id already exists.
    headers: { "content-type": "application/json",
               "x-access-token": token },
    body: JSON.stringify(overdub)
  })
  .then(handleResponse)
  .catch(handleError);
}

export function deleteOverdub(overdubId) {
  const token = localStorage.token;
  return fetch(baseUrl + overdubId, {
    method: "DELETE",
    headers: { "x-access-token": token }
 })
    .then(handleResponse)
    .catch(handleError);
}

async function createAudioBufferFromUrl(audioContext, overdub) {
  const response = await fetch(overdub.url)
  const arrayBuffer = await response.arrayBuffer()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  return audioBuffer
}

export function loadOverdubs(audioContext, title="none") {
  // extract this later
  return getOverdubsByTitle(title)
    .then(async (overdubs) => {
      console.log(overdubs)
      const promises = overdubs.map(async overdub => {
        overdub.buffer = createAudioBufferFromUrl(audioContext, overdub)
        return overdub
      })
      const overdubsWithBuffers = await Promise.all(promises)
      return overdubsWithBuffers
    })
    .catch(error => {
      throw error;
    });
}

export async function createOverdubBufferSources(audioContext, overdubs){
  // Create array of audio source nodes for overdubs
  overdubs.map((overdub) => {
    overdub.source = audioContext.createBufferSource(overdub.buffer)
    return overdub
  })
  // this.props.actions.reloadOverdubs(false)
  return overdubs
}

// export function saveOverdubs(overdubs) {
//   // eslint-disable-next-line no-unused-vars
//   return function(dispatch, getState) {
//     overdubs.forEach((overdub) => {
//       dispatch(beginApiCall());
//       overdubApi
//       .saveOverdub(overdub)
//       .then(savedOverdub => {
//         toast.success("Overdub saved.");
//         overdub.id
//           ? null
//           : dispatch(createOverdubSuccess(savedOverdub));
//       })
//       .catch(error => {
//         dispatch(apiCallError(error));
//         throw error;
//       });
//     });
//   };
// }

// export function deleteOverdub(overdub) {
//   return function(dispatch) {
//     // Doing optimistic delete, so not dispatching begin/end api call
//     // actions, or apiCallError action since we're not showing the loading status for this.
//     dispatch(deleteOverdubOptimistic(overdub));
//     return overdubApi.deleteOverdub(overdub.id)
//       .then(() => {
//         dispatch(loadOverdubs())
//       });
//   };
// }
