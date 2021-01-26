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
    console.log("save overdub with ID, ", overdub.id)
    saveOverdub(overdub).then((result)=>{
      console.log("overdub saved")
      console.log(result)
    })
  });
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

export async function loadOverdubs(audioContext, title="none") {
  console.log("loadOverdubs: ", title)
  let overdubs = await getOverdubsByTitle(title)
  let overdubPromises = getOverdubPromises(audioContext, overdubs)
  let overdubsWithBuffers = await Promise.all(overdubPromises)
  let filteredOverdubs = overdubsWithBuffers.filter(function (e) {return e != null;})
  return filteredOverdubs
}

async function createAudioBufferFromUrl(audioContext, url) {
  console.log("createAudioBufferFromUrl: ", url)
  const file = await fetch(url)
  console.log("get arrayBuffer")
  const arrayBuffer = await file.arrayBuffer()
  console.log("decodeAudioData")
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  console.log(audioBuffer)
  return audioBuffer
}

function getOverdubPromises(audioContext, overdubs){
  console.log("getOverdubPromises: ", overdubs)
  return overdubs.map(async overdub => {
    try {
      let result = await createAudioBufferFromUrl(audioContext, overdub.url)
      overdub.buffer = result
      return overdub
    } catch {
      console.error("Could not decode audio for: ", overdub.url)
    }
  })
}

export function createBufferFromUrl(audioContext, url){
  return createAudioBufferFromUrl(audioContext, url)
}

export async function upload(overdub, title){
  console.log("UPLOAD")
  let fileType = 'webm'
  let file = await fetch(overdub.url).then(r => r.blob())
  let s3Data = await getS3cert(fileType).then((r) => {return r.data.data.returnData})
  await postAudio(s3Data.signedRequest, file, fileType)
  return await postOverdub(overdub, title, s3Data.url)
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

function postAudio(s3sign, file, fileType){
  let options = {
    headers: {
      'Content-Type': fileType
    }
  }
  return axios.put(s3sign, file, options)
}
