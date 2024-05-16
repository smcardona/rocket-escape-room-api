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
    hideNode(info)
    // unhide interaction plane
    unhideNode(renderPlane)

  }
  catch (e) { console.error(e) };
}

// Function to process choice
function executeChoice(apiData) {
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

        for (let depends of response.depends) {
          const dependency = await getApiData(depends.uri);

          const dependsCorrectly = depends.equality
            ? depends.compare_with == dependency?.[depends.compare_prop ?? 'value']
            : depends.compare_with != dependency?.[depends.compare_prop ?? 'value'];


          if (dependsCorrectly) {
            const redirectApiData = {
              method: 'GET',
              uri: depends.redirect
            }
            console.log(`REDIRECT to "${depends.redirect}"`);
            executeChoice(redirectApiData);
            return;
          }
        }

      }


      if (apiData.redirect) {
        const redirectApiData = {
          method: 'GET',
          uri: apiData.redirect
        }
        console.log("redirecting to " + apiData.redirect)
        executeChoice(redirectApiData);
        return
      }
      // If pases all redirections it naturally renders the response
      render(response)
    })
    .catch(error => console.error('Error processing choice:', error));
}

async function getApiData(uri, request = { method: "GET" }) {
  return fetch(uri, request)
    .then(apiResponse => {
      if (!apiResponse.ok) {
        throw new Error(`Failed to getApiData from "${uri}" : ${apiResponse.status} `);
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
  });
  fetch('/user?id=llave').then(
    llaves => llaves.json()
  ).then(llaves => {
    llaves.forEach(() => {
      fetch('user/llave', { method: 'DELETE' })
    })
  })
  fetch('/user?id=llave-asc').then(
    llaves => llaves.json()
  ).then(llaves => {
    llaves.forEach(() => {
      fetch('/user/llave-asc', { method: 'DELETE' })
    })
  })

  console.log('Values reseted correctly');
}