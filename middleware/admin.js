const jwt = require('jsonwebtoken');

// middleware/admin.js
const IsAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Non authentifié' });
  }

  if (String(req.user.role).toUpperCase() !== 'ADMIN') {
    return res.status(403).json({ message: 'Accès interdit : admins uniquement' });
  }

  next();
};

module.exports = IsAdmin; 


