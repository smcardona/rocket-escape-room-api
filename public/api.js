


async function requestToApi(request) {
  if (typeof request == 'string')
    request = generateRequest(request);

  const { uri } = request;

  if (!uri)
    throw new Error("Invalid request. Uri not specified");

  return fetch(uri, request)
    .then(apiResponse => {
      if (!apiResponse.ok) {
        throw new Error(`${request.method} failed to "${uri}" : ${apiResponse.status} `);
      }
      // Request logger
      console.log(`${request.method} successful to ${BASE_URI + uri}`);
      return apiResponse.json();

    })
    .catch(e => console.error(e.message))
}


function generateRequest(uri, originalRequest = { method: "GET" }) {
  // filtered copy of the request
  const request = { ...originalRequest, redirect: undefined };

  if (request.method != 'GET') {
    request.headers = { 'Content-Type': 'application/json' };
    request.body = request.body ? JSON.stringify(request.body) : undefined;
  }

  request.uri = uri;
  return request;
}