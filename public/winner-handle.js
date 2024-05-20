
const TOKEN_PASSWD = "asdf";
let getToken = async () => await requestToApi('/user/winning_token', false);
const WINNERS = document.getElementById('winners_data');


const loadWinners = async () => {
    clearWinners();

    requestToApi('/winners', false)
        .then(winners =>
            winners.forEach(winner => renderWinner(winner)));
}

loadWinners();

// Validates if user is winner so it can sign in in the table
(async () => {
    let value = (await getToken())?.value;
    if (value == TOKEN_PASSWD) {
        loadSignInSection();
    }
}
)();


function loadSignInSection() {
    const signIn = document.createElement('div');
    signIn.id = 'sign-in';

    const info = document.createElement('p');
    info.innerHTML =
        'Al haber ganado, puedes inscribirte a la tabla de ganadores<br>' +
        'Escribe cómo quieres ser reconocido en la lista:';
    signIn.appendChild(info);

    const username = document.createElement('input');
    username.placeholder = 'alias';
    signIn.appendChild(username);

    const ok = document.createElement('button');
    ok.innerHTML = 'Aceptar';
    ok.onclick = () => addWinner(username.value);
    signIn.appendChild(ok);

    const cancel = document.createElement('button');
    cancel.innerHTML = 'NO';
    cancel.onclick = () => signIn.remove();
    signIn.appendChild(cancel);


    document.getElementById('container').appendChild(signIn)
}

async function addWinner(username) {
    if (!username) {
        console.warn('Didnt add winner: No username provided')
        return;
    }
    const IP = await getIP();
    const request = generateRequest('/winners', {
        method: 'POST',
        body: {
            id: username,
            ip: IP,
            date: new Date()
        }
    });

    requestToApi(request)
        .then(() => resetUserValues())

    const signIn = document.getElementById('sign-in');
    signIn.remove();

}

function renderWinner(winner) {
    const row = document.createElement('tr');
    const nombre = document.createElement('td');
    nombre.innerHTML = winner.id;
    const ip = document.createElement('td');
    ip.innerHTML = winner.ip;
    row.appendChild(nombre);
    row.appendChild(ip);

    WINNERS.appendChild(row);
}

function clearWinners() {
    WINNERS.innerHTML = '';
}

