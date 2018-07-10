const express = require('express'),
    app = express(),
    socket = require('socket.io'),
    server = app.listen(3000, () => console.log('Listening on port 3000...')),
    io = socket(server),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/clients', { useNewUrlParser: true })
    .then(() => console.log('Connected to mongoDB...'))
    .catch(error => console.log('Could not connect to mongoDB!'.error));

app.use(express.static('static'));

const Client = mongoose.model('Client', new mongoose.Schema({
    id: String,
    allow: {
        type: Boolean,
        default: true
    },
    relation: String
}));

io.on('connection', async socket => {
    const client = await Client({ id: socket.id }); // add to db connected user
    await client.save();

    socket.emit('id', client.id); // send socket id to client side

    socket.on('destination', async(id, message) => { //call when one client want to connect to another client
        const client = await Client.find({ id: id });
        if (!client.length) return io.to(socket.id).emit('message', 'User with given id is not found');

        if (client[0].allow) { //check if user which we want to connect is allowed
            // make connected users as not allow and set relations between them
            await Client.update({ id: socket.id }, {
                $set: {
                    allow: false,
                    relation: id
                }
            });

            await Client.update({ id: id }, {
                $set: {
                    allow: false,
                    relation: socket.id
                }
            });

            io.to(id).emit('message', message); // send message by id (first)
        } else if (client[0].relation === socket.id) { // send message by id second time and more
            io.to(id).emit('message', message);
        } else if (client[0].relation === id) { // in case when user send message back
            io.to(socket.id).emit('message', message);
        } else { // in case when another user try to connect to not allowed users
            io.to(socket.id).emit('message', 'User is not allowed now.');
        }
    });

    socket.on('disconnect', async() => { // remove all date when user reload or leave page
        const client = await Client.find({ id: socket.id }).remove();
    });

    // P.S data from db not remove if just restart server
});