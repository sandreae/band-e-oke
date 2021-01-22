import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.API_URL;
import axios from 'axios'
import { showLoading, hideLoading } from 'react-redux-loading-bar'

let UPLOAD_URL

export function getOverdubs() {
  const token = localStorage.token;
  return fetch(baseUrl + "overdubs/", {
    headers: { "x-access-token": token },
  })
    .then(handleResponse)
    .catch(handleError);
}

export function getOverdubsByTitle(title) {
  const token = localStorage.token;
  return fetch(baseUrl + "overdubs/" + 'title/' + title, {
    headers: { "x-access-token": token },
  })
    .then(handleResponse)
    .catch(handleError);
}

export function saveOverdub(overdub) {
  const token = localStorage.token;
  return fetch(baseUrl + "overdubs/" + (overdub.id || ""), {
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
  return fetch(baseUrl + "overdubs/" + overdubId, {
    method: "DELETE",
    headers: { "x-access-token": token }
 })
    .then(handleResponse)
    .catch(handleError);
}

async function createAudioBufferFromUrl(audioContext, url) {
  const file = await fetch(url)
  const arrayBuffer = await file.arrayBuffer()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  return audioBuffer
}

export function loadOverdubs(audioContext, title="none") {
  // extract this later
  return getOverdubsByTitle(title)
    .then(async (overdubs) => {
      console.log(overdubs)
      const promises = overdubs.map(async overdub => {
        createAudioBufferFromUrl(audioContext, overdub.url).then((result)=>{
          overdub.buffer = result
          return overdub
        })
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

export function createBufferFromUrl(audioContext, url){
  return createAudioBufferFromUrl(audioContext, url)
}
//
// const processAudio = async (audioContext, overdub) => {
//   return fetch(overdub.url).then(async (fetchedFile)=>{
//     const arrayBuffer = await fetchedFile.arrayBuffer()
//     overdub.buffer = await audioContext.decodeAudioData(arrayBuffer)
//     return overdub
//   })
// }
//
// export function processNewOverdub(audioContext, overdub) {
//   console.log("CALL")
//   return function(dispatch) {
//     // dispatch(audioActions.processingNewOverdub(true))
//     return processAudio(audioContext, overdub).then((overdub => {
//       // dispatch(setOverdubBuffer(overdub))
//       // dispatch(audioActions.processNewOverdubComplete(true))
//       return overdub
//     }))
//   }
// }

function getS3cert(fileType){
  let fileName = new Date()
  return axios.post(baseUrl + 'sign_s3',{
    fileName : fileName,
    fileType : fileType
  })
}

function postOverdub(overdub, title, url){
  let token = localStorage.token
  var options = {
    headers: {
      'x-access-token': token
    }
  }
  return axios.post(baseUrl + "overdubs", {
    url: url,
    nudge: overdub.nudge,
    gain: overdub.gain,
    title: title,
  }, options)
}

function postAudio(s3sign, file, fileType){
  let options = {
    headers: {
      'Content-Type': fileType
    }
  }
  return axios.put(s3sign, file, options)
}

export async function upload(overdub, title){
  console.log("UPLOAD")
  let fileType = 'webm'
  let file = await fetch(overdub.url).then(r => r.blob())
  let s3Data = await getS3cert(fileType).then((r) => {return r.data.data.returnData})
  await postAudio(s3Data.signedRequest, file, fileType)
  return await postOverdub(overdub, title, s3Data.url)
}
