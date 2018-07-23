const mongoose = require('mongoose');
const io = require('socket.io').listen(8000);

mongoose.connect('mongodb://localhost:27017/devices', { useNewUrlParser: true })
    .then(() => console.log('Connected to mongoDB...'))
    .catch(error => console.log('Could not connect to mongoDB...'));

const Device = mongoose.model('Devices', new mongoose.Schema({
    id: String,
    deviceId: String,
    controllerId: String,
    free: {
        type: Boolean,
        default: true
    },
    relation: String
}));

// clean all data in the database
(async() => {
    await Device.find().remove();
})();

io.on('connection', socket => {
    console.log('Switch: Controller connected');

    socket.on('data', async data => {
        data = JSON.parse(data);
        data = Object.assign({}, data);

        //check if destination devise is registered on switch
        const deviceDest = await Device.findOne({ id: data.destination });

        if(!deviceDest) {
            console.log('User with given ID is not found!');
            return io.to(data.controllerId).emit('feedback', JSON.stringify({
                deviceId: data.deviceId,
                message: 'User with given ID is not found!'
            }));
        }

        if (deviceDest.free || deviceDest.relation === data.id) {

            if(deviceDest.free) { //create kind of room for 2 devices and set both as busy
                await Device.update({ id: data.id }, {
                    $set: {
                        free: false,
                        relation: data.destination
                    }
                });

                await Device.update({ id: data.destination }, {
                    $set: {
                        free: false,
                        relation: data.id
                    }
                });
            }

            //send to specific controller data with id of device and message
            io.to(data.destination.slice(-20)).emit('switch', JSON.stringify({
                deviceId: data.destination.slice(0, 20),
                message: data.message
            }));

            //send to controller who made request feedback about success operation
            io.to(data.controllerId).emit('feedback', JSON.stringify({
                deviceId: data.deviceId,
                message: 'Sent'
            }));
        } else {
            // in case if device is busy
            io.to(data.controllerId).emit('feedback', JSON.stringify({
                deviceId: data.deviceId,
                message: 'User is not allowed.'
            }));
        }
    });

    //device register
    socket.on('register', async id => {
        id = JSON.parse(id);
        const device = await Device({
            id: id.deviceId + id.controllerId,
            deviceId: id.deviceId,
            controllerId: id.controllerId
        });
        await device.save();
    });

    //if device after converstation leave ester set companion to free and remove device from database
    socket.on('leave', async id => {
        id = JSON.parse(id);

        await Device.update({ relation: id}, {
            $set:{
                free: true
            }
        });

        await Device.find({id: id}).remove();
    });

    socket.on('disconnect', async () => {
        console.log('Switch: Controller disconnected');
    });
});