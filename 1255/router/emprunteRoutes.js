const express = require('express');
const router = express.Router();
const emprunteController = require('../controller/emprunteController');
const Bibliothécaire = require('../model/Bibliothécaire.model');
// Définir la route pour la demande d'emprunt
router.post('/demande-emprunt/:userId/:livreId', emprunteController.demandeEmprunt);
router.get('/getdemande', emprunteController.getAllDemandes);
router.put('/demandes/:demandeId', emprunteController.updateDemandeEmprunt);
router.post('/accepterDemande/:demandeId',  emprunteController.accepterDemande);
router.delete('/deletedemande/:demandeId', emprunteController.supprimerEmprunt);
router.put('/retourner/:livreId', async (req, res) => {
    try {
      const { livreId } = req.params;
      // Mettre à jour la disponibilité du livre à true
      await Bibliothécaire.findByIdAndUpdate(livreId, { disponibilite: true,retourne: true });
      res.json({ message: "Livre retourné avec succès" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

router.get('/emprunts-acceptes', emprunteController.getAllEmpruntsAcceptes);
module.exports = router;
