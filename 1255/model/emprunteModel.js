const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emprunteSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    livreId: {
        type: Schema.Types.ObjectId,
        ref: 'Bibliothécaire',
        required: false
    },
  
        etat: { type: String, enum: ['En attente', 'Acceptée', 'Refusée'], default: 'En attente' },
    
    
    titreLivre: {
        type: String,
        required: false
    },
    genreLivre: {
        type: String,
        required: false
    },
    dateEmprunt: {
        type: Date,
        default: Date.now
    },
    dateRetour: {
        type: Date
    },
    retourne: {
        type: Boolean,
        default: false
    }
});

const Emprunte = mongoose.model('Emprunte', emprunteSchema);

module.exports = Emprunte;
