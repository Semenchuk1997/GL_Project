const { Client } = require('./clientModel');
const Switch = require('../switch/switch');

module.exports = (io) => {
    return async (socket, next) => {
        const client = await Client({ id: socket.id });
        await client.save();

        socket.emit('id', client.id); // send socket id to client side

        socket.on('disconnect', async() => { // remove all date when user reload or leave page
            const client = await Client.find({ id: socket.id }).remove();
        });

        return next();
    };
};