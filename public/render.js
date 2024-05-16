// debug settings
const PORT = 80; // change if you are using diferent
const HOST = 'localhost';
const BASE_URI = `http://${HOST}:${PORT}`; // PORT deberia ser configurado desde fuera pero no se como hacerlo



// start page data
let startData;
(async () => startData = await getApiData('/start'))();
function start() {
  try {
    // restores data base
    resetGameValues();

    // apply fields to the template
    render(startData);
    // hide info
    info.hidden = true;
    // unhide interaction plane
    renderPlane.removeAttribute('hidden');

  }
  catch (e) { console.error(e) };
}

// Function to process choice
function processChoice(apiData) {
  const { method, uri } = apiData;
  const request = { method: method };

  if (method != 'GET') {
    request.headers = { 'Content-Type': 'application/json' };
    request.body = apiData.body ? JSON.stringify(apiData.body) : undefined;
  }

  getApiData(uri, request)
    .then(async response => {
      // Here checks if response requires a condition, if not then redirect
      if (response.depends) {
        response.depends.forEach(async depends => {

          const dependency = await getApiData(depends.uri);
          if (
            depends.equality ? depends.compare_with == dependency?.value :
              depends.compare_with != dependency?.value
          ) {
            const redirectApiData = {
              method: 'GET',
              uri: depends.redirect
            }
            console.log("redirecting to " + depends.redirect)
            processChoice(redirectApiData);
            return;
          }
        })
      }


      if (apiData.redirect) {
        const redirectApiData = {
          method: 'GET',
          uri: apiData.redirect
        }
        console.log("redirecting to " + apiData.redirect)
        processChoice(redirectApiData);
      }
      else render(response)
    })
    .catch(error => console.error('Error processing choice:', error));
}

async function getApiData(uri, request = { method: "GET" }) {
  return fetch(uri, request)
    .then(apiResponse => {
      if (!apiResponse.ok) {
        throw new Error('Failed to getApiData: ' + apiResponse.status);
      }
      // Se puede hacer mas cosas aqui, pero no hace falta
      console.log(`${request.method} successful to ${BASE_URI + uri}`);
      return apiResponse.json();

    })
    .catch(e => console.error(e.message))
}


function resetGameValues() {
  fetch('/user/pokemon', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 'pokemon', value: null })
  })
    .then(() => fetch('/user/llave', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'llave', value: false })
    }))
    .then(() => fetch('/user/llave-asc', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'llave-asc', value: false })
    }))
    .then(() => console.log('Succesfully loaded starting page!'))
    .catch(e => console.error('Error reseting game values page: ' + e.message))
}