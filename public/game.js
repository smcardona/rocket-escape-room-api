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

  if (!apiData.uri) {
    window.location.href = apiData.page_redirect;
    return
  }

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

      if (apiData.page_redirect) {
        window.location.href = apiData.page_redirect;
        return
      }

      // If pases all redirections it naturally renders the response
      render(response)
    })
    .catch(error => console.error('Error processing api data:', error));
}



function resetGameValues() {
  const logging = false;
  fetch('/user/pokemon', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 'pokemon', value: null })
  });
  requestToApi('/user?id=llave', logging)
    .then(llaves => {
      llaves.forEach(() =>
        fetch('user/llave', { method: 'DELETE' })
      )
    })
  requestToApi('/user?id=llave-asc', logging)
    .then(llaves => {
      llaves.forEach(() =>
        fetch('/user/llave-asc', { method: 'DELETE' })
      )
    })
  requestToApi('/user?id=winning_token', logging)
    .then(wins => {
      wins.forEach(() =>
        fetch('/user/winning_token', { method: 'DELETE' })
      )
    })

  console.log('Values reseted correctly');
}
