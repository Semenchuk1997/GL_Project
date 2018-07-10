const socket = io('http://localhost:3000');

document.querySelector('.send').addEventListener('click', e => {
    socket.emit('destination', document.querySelector('.dest').value, document.querySelector('.textarea').value);
});

socket.on('id', id => {
    document.querySelector('.id').innerHTML = id;
});

socket.on('message', message => {
    let li = document.createElement('li');
    li.innerHTML = `<h3>${message}</h3>`;
    document.querySelector('.chat').appendChild(li);
});