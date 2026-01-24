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

module.exports = { getMyMessages };
