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
  return fetch(baseUrl + (overdub.id || ""), {
    method: overdub.id ? "PUT" : "POST", // POST for create, PUT to update when id already exists.
    headers: { "content-type": "application/json" },
    body: JSON.stringify(overdub)
  })
}

export function deleteOverdub(overdubId) {
  const token = localStorage.token;
  return fetch(baseUrl + overdubId, {
    method: "DELETE",
    headers: { "x-access-token": token },
 })
    .then(handleResponse)
    .catch(handleError);
}
