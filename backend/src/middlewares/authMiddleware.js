const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Accès refusé, token manquant' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
    id: decoded.id,
    role: decoded.role,
    email: decoded.email, // 👈 IMPORTANT
  };


    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expirée, reconnectez-vous' });
    }

    return res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = auth;
