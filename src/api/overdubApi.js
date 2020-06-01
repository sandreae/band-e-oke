import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.API_URL + "overdubs/";

export function getOverdubs() {
  return fetch(baseUrl)
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
  return fetch(baseUrl + overdubId, { method: "DELETE" })
    .then(handleResponse)
    .catch(handleError);
}
