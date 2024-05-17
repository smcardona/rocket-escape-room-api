// document important objects
const info = document.getElementById('game-info');
const renderPlane = document.getElementById('render');

// render fields
//* sorry for the snake case
const TITLE = document.getElementById('title');
const MESSAGE = document.getElementById('message');
const IMAGE_SCENE = document.getElementById('scene-container')
const IMAGE = document.getElementById('scene');
const BUTTONS = document.getElementById('buttons');
const INPUTS = document.getElementById('inputs');

function render(data) {

  // render or hide title
  if (data.title) {
    TITLE.innerHTML = data.title
    unhideNode(TITLE)
  }
  else hideNode(TITLE)

  // message can be array of strings for json prettyness purposes
  MESSAGE.innerHTML =
    Array.isArray(data.message) ?
      data.message.join('') :
      data.message;


  if (data.image) {
    IMAGE.setAttribute('src', data.image)
    unhideNode(IMAGE_SCENE)
  }
  else hideNode(IMAGE_SCENE)

  BUTTONS.innerHTML = '';
  // Loop through buttons and create buttons
  if (data.buttons) {
    data.buttons.forEach(buttonData => {
      renderButton(buttonData);
    });

    unhideNode(BUTTONS)
  } else hideNode(BUTTONS);

  INPUTS.innerHTML = ''
  if (data.inputs) {
    const actionBtn = document.createElement('button');

    data.inputs.forEach(inp => {
      const group = document.createElement('div'); // div for label and input

      const input = document.createElement('input');
      input.setAttribute('id', inp.label);

      const label = document.createElement('label');
      label.innerHTML = inp.label;
      group.appendChild(label)
      group.appendChild(input)


      INPUTS.appendChild(group)
    })

    actionBtn.innerHTML = 'Confirm';

    actionBtn.onclick = function () {

      // Store each input value depending on the input HTTP METHOD
      data.inputs.forEach(async inp => {
        const input = document.getElementById(inp.label);
        inp.api.body[inp.api.new_property ?? "value"] = input.value.toLowerCase() || null;
        const request = generateRequest(inp.api.uri, inp.api);
        console.log(request)
        await requestToApi(request);
      })

      loadFromApi(generateRequest(data.input_redirect));
    };

    INPUTS.appendChild(actionBtn);

    unhideNode(INPUTS); // if it was hidden, it shows back to the screen

  } else hideNode(INPUTS);
}


// Rendering functions
function renderButton(buttonData) {
  const button = document.createElement('button');
  button.textContent = buttonData.label;
  button.onclick = function () { loadFromApi(buttonData.api); };
  BUTTONS.appendChild(button);
}


// Visibilty functions
function hideNode(node) {
  node.style.display = "none"
}

function unhideNode(node) {
  node.removeAttribute('style')
}