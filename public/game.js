// debug settings
const PORT = 80; // change if you are using diferent
const HOST = 'localhost';
const BASE_URI = `http://${HOST}:${PORT}`; // PORT deberia ser configurado desde fuera pero no se como hacerlo



// start page data
let startData;
(async () => startData = await requestToApi('/start'))();
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
function loadFromApi(apiData) {

  const request = generateRequest(apiData.uri, apiData);

  requestToApi(request)
    .then(async response => {
      // Here checks if response requires a condition, if not then redirect
      if (response.depends) {

        for (let depends of response.depends) {
          const dependency = await requestToApi(depends.uri);

          const dependsCorrectly = depends.equality
            ? depends.compare_with == dependency?.[depends.compare_prop ?? 'value']
            : depends.compare_with != dependency?.[depends.compare_prop ?? 'value'];


          if (dependsCorrectly) {
            console.log(`DEPENDENCY REDIRECT to "${depends.redirect}"`);
            loadFromApi(generateRequest(depends.redirect));
            return;
          }
        }

      }


      if (apiData.redirect) {

        console.log(`FORWARD REDIRECT to "${apiData.redirect}"`)
        loadFromApi(generateRequest(apiData.redirect));
        return
      }
      // If pases all redirections it naturally renders the response
      render(response)
    })
    .catch(error => console.error('Error processing choice:', error));
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


function getIP(json) {
  const req = generateRequest('/winners-ips', { method: 'POST', body: { id: json.ip, date: new Date() } });
  requestToApi(req)
}