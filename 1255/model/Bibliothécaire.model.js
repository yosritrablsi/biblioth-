const mongoose = require('mongoose');

const BibliothécaireSchema = new mongoose.Schema({
    idlivre: {
        type: String,
        required: false 
    },
    titre: {
      type: String,
      required: true 
  },
  genre: {
    type: String,
    required: true 
},
    disponibilite: {
        type: Boolean,
        default: true
    
    },
  
    anneePublication: {
        type: Number,
        required: true
    },
  auteur:{
    type: String,
    required: true 
  },
  emprunteurs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Bibliothécaire = mongoose.model('Bibliothécaire',BibliothécaireSchema);

module.exports = Bibliothécaire;
