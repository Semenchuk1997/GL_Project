const express = require('express');
const app = express();
const ioSwitch = require('socket.io-client');
const socketSwitch = ioSwitch.connect('http://localhost:8000', {reconnect: true});

const socket = require('socket.io');
const server = app.listen(3001, () => console.log('Controller: Listening on port 3001...'));
const io = socket(server);

app.use(express.json());
app.use(express.static('public'));

const id ={
    deviceId: null,
    controllerId: null
};

socketSwitch.on('connect', () => {
    console.log('Client: Controller connected to switch!');
    id.controllerId = socketSwitch.id;
});

socketSwitch.on('switch', data => {
    data = JSON.parse(data);

    io.to(data.deviceId).emit('message', JSON.stringify(data.message));
});

socketSwitch.on('feedback', data => {
    data = JSON.parse(data);

    io.to(data.deviceId).emit('message', JSON.stringify(data.message));
});

io.on('connection', socket => {
    console.log('A device connected');
    id.deviceId = socket.id;

    socket.emit('id', JSON.stringify(id.deviceId + id.controllerId));
    socketSwitch.emit('register', JSON.stringify(id));

    socket.on('send', data => {
        data = JSON.parse(data);
        data = Object.assign({}, data);

        const user = Object.assign(data, {
            deviceId: data.id.slice(0, 20),
            controllerId: data.id.slice(-20)
        });

        socketSwitch.emit('data', JSON.stringify(user));
    });

    socket.on('disconnect', () => {
        console.log('A device disconnected');
        socketSwitch.emit('leave', JSON.stringify(socket.id + id.controllerId));
    });

    socket.on('connect_failed', () => {
        console.log('Connection failed');
    });
});

io.on('connect_error', () => {
    console.log('Server is offline');
});