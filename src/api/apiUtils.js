export async function handleResponse(response) {
  console.log(response)
  if (response.ok) return response.json();
  if (response.status === 400) {
    const error = await response.text();
    // error handling needed
    throw new Error(error);
  }
  throw new Error("Network response was not ok.");
}

export function handleError(error) {
  // eslint-disable-next-line no-console
  // error handling needed
  throw error;
}
