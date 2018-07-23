const socket = io('http://localhost:3000');

document.querySelector('.send').addEventListener('click', () => {
    socket.emit('send', JSON.stringify({
        id: document.querySelector('.id').innerText,
        destination: document.querySelector('.dest').value,
        message: document.querySelector('.textarea').value
    }));
});

socket.on('id', id => {
    id = JSON.parse(id);
    document.querySelector('.id').innerHTML = id;
});

socket.on('message', message => {
    message = JSON.parse(message);
    let li = document.createElement('li');
    li.innerHTML = `<h3>${message}</h3>`;
    document.querySelector('.chat').appendChild(li);
});