const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    nom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    // Ajoutez d'autres champs si nécessaire
    livresEmpruntes: [{
        type: Schema.Types.ObjectId,
        ref: 'Bibliothécaire'
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
