// empruntAccepteModel.js

const mongoose = require('mongoose');

const empruntAccepteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    livreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Livre',
        required: true
    },
    dateEmprunt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('EmpruntAccepte', empruntAccepteSchema);
