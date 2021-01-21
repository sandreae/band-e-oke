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

async function createAudioBufferFromUrl(audioContext, url) {
  const response = await fetch(url)
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
        overdub.buffer = createAudioBufferFromUrl(audioContext, overdub.url)
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

// async function processAudio(audioContext, file) {
//   const response = await fetch(file)
//   const arrayBuffer = await response.arrayBuffer()
//   const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
//   return audioBuffer
// }

export function loadBackingTrack(audioContext, url){
  return createAudioBufferFromUrl(audioContext, url)
}

// export function processBackingTrack(audioContext, backingTrack) {
//   return function(dispatch) {
//     // dispatch(showLoading())
//     // dispatch(processingBackingTrack(true))
//     const audioBuffer = processAudio(audioContext, backingTrack)
//       .then((audioBuffer) => {
//         // dispatch(processBackingTrackComplete(true))
//         // toast.success("Backing track audio ready. ");
//         // dispatch(hideLoading())
//         return audioBuffer
//       }
//     )
//     return audioBuffer
//   }
// }
