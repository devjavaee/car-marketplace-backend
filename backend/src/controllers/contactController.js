const Car = require('../models/Car');
const { sendEmail } = require('../services/mailer');
const Message = require('../models/Message');
const User = require('../models/User');

const contactSeller = async (req, res) => {
  try {
    const { message } = req.body;
    const carId = req.params.id;

    if (!message) {
      return res.status(400).json({ message: 'Message requis' });
    }

    const car = await Car.findById(carId).populate('seller');
    if (!car || !car.seller) {
      return res.status(404).json({ message: 'Voiture ou vendeur introuvable' });
    }

    // 🔐 récupérer l'expéditeur depuis le token
    const sender = await User.findById(req.user.id);
    if (!sender || !sender.email) {
      return res.status(401).json({ message: 'Utilisateur invalide' });
    }

    // 📧 envoi email
    await sendEmail({
      to: car.seller.email,
      subject: `Nouveau message pour votre ${car.brand} ${car.model}`,
      text: `
Bonjour,

${sender.email} est intéressé par votre véhicule.

Message :
${message}

---
Car Marketplace
      `,
    });

    // 💾 sauvegarde message
    await Message.create({
      car: car._id,
      seller: car.seller._id,
      senderEmail: sender.email,
      content: message,
    });

    return res.status(200).json({ message: 'Message envoyé au vendeur' });

  } catch (error) {
    console.error('CONTACT SELLER ERROR:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { contactSeller };
