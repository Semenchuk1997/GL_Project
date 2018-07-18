const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
const socket = require('socket.io');
const io = socket(server);
const Controller = require('./controller/controller')(io);
const {Client} = require('./controller/clientModel');

mongoose.connect('mongodb://localhost:27017/clients', { useNewUrlParser: true })
    .then(() => console.log('Connected to mongoDB...'))
    .catch(error => console.log('Could not connect to mongoDB...'));

(async () => {
    await Client.remove();
})();

app.set('socketio', io);

app.use(express.json());
app.use(express.static('client'));
io.use(Controller);