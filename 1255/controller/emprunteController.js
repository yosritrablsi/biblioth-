const DemandeEmprunt = require('../model/emprunteModel');
const User = require('../model/authentification.model');
const Bibliothécaire = require('../model/Bibliothécaire.model');
const EmpruntAccepte = require('../model/empruntAccepteModel');

exports.demandeEmprunt = async (req, res) => {
    try {
        const { userId, livreId } = req.params; // Récupérer userId et livreId à partir des paramètres de la requête

        // Vérification si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        // Vérification si le livre existe et s'il est disponible
        const livre = await Bibliothécaire.findById(livreId);
        if (!livre) {
            return res.status(404).json({ message: "Livre introuvable" });
        }
        if (!livre.disponibilite) {
            return res.status(400).json({ message: "Livre non disponible" });
        }

        // Récupérer tous les emprunts de l'utilisateur
        const userEmprunts = await DemandeEmprunt.find({ userId: userId });

        // Vérifier le nombre total d'emprunts de l'utilisateur
        if (userEmprunts.length >= 3) {
            return res.status(400).json({ message: "Vous avez déjà emprunté 3 livres. Vous ne pouvez pas emprunter plus." });
        }

        // Création d'une nouvelle instance de demande d'emprunt
        const demande = new DemandeEmprunt({
            userId: userId, // Utiliser userId directement
            livreId: livreId,
            dateDemande: new Date()
        });

        // Sauvegarde de la demande d'emprunt dans la base de données
        const savedDemande = await demande.save();

        // Envoi de la réponse avec le message de succès
        res.json({ message: "Demande d'emprunt envoyée avec succès", demande: savedDemande });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getAllDemandes = async (req, res) => {
    try {
        // Récupérer toutes les demandes d'emprunt
        const demandes = await DemandeEmprunt.find();
        res.json(demandes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateDemandeEmprunt = async (req, res) => {
    try {
        const { demandeId } = req.params;
        const { nouvelEtat } = req.body;

        // Vérification si la demande existe
        const demande = await DemandeEmprunt.findById(demandeId);
        if (!demande) {
            return res.status(404).json({ message: "Demande introuvable" });
        }

        // Mettre à jour l'état de la demande
        demande.etat = nouvelEtat;
        await demande.save();

        // Si la demande est acceptée, enregistrez-la dans le modèle EmpruntAccepte
        if (nouvelEtat === "acceptée") {
            const empruntAccepte = new EmpruntAccepte({
                userId: demande.userId,
                livreId: demande.livreId,
                dateEmprunt: new Date()
                // Vous pouvez ajouter d'autres champs si nécessaire
            });
            await empruntAccepte.save();
        }

        // Supprimez la demande d'emprunt si elle est acceptée ou refusée
        if (nouvelEtat === "acceptée" || nouvelEtat === "refusée") {
            await DemandeEmprunt.findByIdAndDelete(demandeId);
        }

        res.json({ message: "État de la demande mis à jour avec succès", demande });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.supprimerEmprunt = async (req, res) => {
    try {
        const { demandeId } = req.params;

        // Supprimer la demande d'emprunt de la base de données
        const demande = await DemandeEmprunt.findByIdAndDelete(demandeId);
        if (!demande) {
            return res.status(404).json({ message: "Demande introuvable" });
        }

        res.json({ message: "Demande d'emprunt supprimée avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


exports.accepterDemande = async (req, res) => {
    try {
        const { demandeId } = req.params;

        // Mettre à jour l'état de la demande
        const updatedDemande = await DemandeEmprunt.findByIdAndUpdate(demandeId, { etat: 'acceptée' }, { new: true });

        // Mettre à jour la disponibilité du livre
        const livre = await Bibliothécaire.findById(updatedDemande.livreId);
        livre.disponibilite = false; // Mettre la disponibilité à false
        await livre.save();

        // Enregistrer la demande d'emprunt acceptée dans EmpruntAccepte
        const empruntAccepte = new EmpruntAccepte({
            userId: updatedDemande.userId,
            livreId: updatedDemande.livreId,
            dateEmprunt: new Date()
            // Ajoutez d'autres champs si nécessaire
        });
        await empruntAccepte.save();

        // Supprimer la demande d'emprunt de la base de données
        await DemandeEmprunt.findByIdAndDelete(demandeId);

        // Envoyer une seule réponse à la fin
        res.json({ message: "Demande d'emprunt acceptée avec succès et demande supprimée", demande: updatedDemande });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllEmpruntsAcceptes = async (req, res) => {
    try {
        // Récupérer toutes les demandes d'emprunt acceptées
        const empruntsAcceptes = await EmpruntAccepte.find();
        res.json(empruntsAcceptes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.retournerLivre = async (req, res) => {
    try {
      const { livreId } = req.params;
      // Mettre à jour la disponibilité du livre à true et le marquer comme retourné
      await Bibliothécaire.findByIdAndUpdate(livreId, { disponibilite: true, retourne: true });
      res.json({ message: "Livre retourné avec succès" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
