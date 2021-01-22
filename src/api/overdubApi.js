import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.API_URL;
import axios from 'axios'

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

export function saveAllOverdubs(overdubs) {
  overdubs.forEach((overdub) => {
    saveOverdub(overdub)
  });

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

function getOverdubPromises(audioContext, overdubs){
  return overdubs.map(async overdub => {
    let result = await createAudioBufferFromUrl(audioContext, overdub.url)
    overdub.buffer = result
    return overdub
  })
}

export async function loadOverdubs(audioContext, title="none") {
  let overdubs = await getOverdubsByTitle(title)
  let overdubPromises = getOverdubPromises(audioContext, overdubs)
  let overdubsWithBuffers = await Promise.all(overdubPromises)
  return overdubsWithBuffers
}

export function createBufferFromUrl(audioContext, url){
  return createAudioBufferFromUrl(audioContext, url)
}

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
