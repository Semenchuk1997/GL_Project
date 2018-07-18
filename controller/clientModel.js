const mongoose = require('mongoose');

const Client = mongoose.model('Client', new mongoose.Schema({
    id: String,
    allow: {
        type: Boolean,
        default: true
    },
    relation: String
}));

exports.Client = Client;