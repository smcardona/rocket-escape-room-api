// debug settings
const PORT = 80; // change if you are using diferent
const HOST = 'localhost';
const BASE_URI = `http://${HOST}:${PORT}`;

// document important objects
const info = document.getElementById('game-info');
const renderPlane = document.getElementById('render');

// render fields
const rTitle = document.getElementById('title');
const rMessage = document.getElementById('message');
const rImageScene = document.getElementById('scene-container')
const rImage = document.getElementById('scene');
const rButtons = document.getElementById('buttons');
const rInputs = document.getElementById('inputs');

// aditional base data
let startData = null;
(async () => startData = await getApiData('/start'))();

function render(data) {
  // render or hide title
  if (data.title) {
    rTitle.innerHTML = data.title;
    rTitle.removeAttribute('hidden');
  }
  else rTitle.style.display = "none";

  rMessage.innerHTML =
    Array.isArray(data.message) ?
      data.message.join('') :
      data.message;

  if (data.image) {
    rImage.setAttribute('src', data.image);
    rImageScene.removeAttribute('style');
  }
  else rImageScene.style.display = "none";

  rButtons.innerHTML = '';
  // Loop through buttons and create buttons
  if (data.buttons) {
    console.log("has button " + data)
    rButtons.removeAttribute('style')

    data.buttons.forEach(choice => {
      const button = document.createElement('button');
      button.textContent = choice.label;
      button.onclick = function () { processChoice(choice.api); };
      rButtons.appendChild(button);
    });
  } else rButtons.style.display = "none";

  if (data.inputs) {
    rInputs.innerHTML = ''
    rInputs.removeAttribute('style')

    data.inputs.forEach(inp => {
      const input = document.createElement('input');
      const label = document.createElement('label');
      const group = document.createElement('div')
      label.innerHTML = inp.label;
      group.appendChild(label)
      group.appendChild(input)
      rInputs.appendChild(group)
    })

  } else rInputs.style.display = "none";

}


function start() {
  try {
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
          if (dependency == null ||
            depends.compare_with != dependency.value
          ) {
            const redirectData = await getApiData(depends.redirect);
            console.log(redirectData)
            render(redirectData);
            return;
          }
        })
      }


      if (apiData.redirect) {
        const redirectData = await getApiData(apiData.redirect);
        render(redirectData);
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
      console.log('Uri fetch successful ' + BASE_URI + uri);
      return apiResponse.json();

    })
    .catch(e => console.error(e.message))
}