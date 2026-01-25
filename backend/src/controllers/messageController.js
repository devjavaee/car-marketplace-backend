// backend/src/controllers/messageController.js
const Message = require('../models/Message');
const Car = require('../models/Car');

const getMyMessages = async (req, res) => {
  try {
    const userId = req.user.id; // depuis le middleware auth

    const messages = await Message.find({ seller: userId })
      .populate('car', 'brand model') // inclut les infos voiture
      .sort({ createdAt: -1 }); // les plus récents en premier

    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message introuvable' });
    }

    // 🔐 Sécurité : seul le vendeur destinataire peut supprimer
    if (message.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    await message.deleteOne();

    res.status(200).json({ message: 'Message supprimé avec succès' });
  } catch (error) {
    console.error('DELETE MESSAGE ERROR:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
const markMessageAsRead = async (req, res) => {
  try {
    const messageId = req.params.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message introuvable' });
    }

    // 🔐 sécurité : seul le vendeur peut marquer comme lu
    if (message.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    message.isRead = true;
    await message.save();

    res.status(200).json({ message: 'Message marqué comme lu' });
  } catch (error) {
    console.error('MARK READ ERROR:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


module.exports = {
  getMyMessages,
  deleteMessage,
  markMessageAsRead,
};