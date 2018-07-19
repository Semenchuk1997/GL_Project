const { Client } = require('../controller/clientModel');

module.exports = function(io) {
    return function (socket, next) {
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

        return next();
    }
}