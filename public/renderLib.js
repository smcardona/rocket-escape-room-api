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

    data.buttons.forEach(choice => {
      const button = document.createElement('button');
      button.textContent = choice.label;
      button.onclick = function () { processChoice(choice.api); };
      BUTTONS.appendChild(button);
    });

    unhideNode(BUTTONS)
  } else hideNode(BUTTONS);

  INPUTS.innerHTML = ''
  if (data.inputs) {
    INPUTS.removeAttribute('style')

    data.inputs.forEach(inp => {
      const input = document.createElement('input');
      const actionBtn = document.createElement('button');
      const label = document.createElement('label');
      const group = document.createElement('div')
      label.innerHTML = inp.label;
      actionBtn.innerHTML = 'Confirm'
      group.appendChild(label)
      group.appendChild(input)
      group.appendChild(actionBtn)
      INPUTS.appendChild(group)


      actionBtn.onclick = function () {
        inp.api.body.value = input.value.toLowerCase();
        processChoice(inp.api);
      }

    })

  } else INPUTS.style.display = "none";
}


function hideNode(node) {
  node.style.display = "none"
}

function unhideNode(node) {
  node.removeAttribute('style')
}