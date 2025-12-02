const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET;

// ACCESS TOKEN — expire vite
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

// REFRESH TOKEN — expire dans 7 jours
function signRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

async function hashPassword(plain) {
  const saltRounds = 10;
  return bcrypt.hash(plain, saltRounds);
}

async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

module.exports = { 
  signRefreshToken,
  signToken,
  hashPassword, 
  comparePassword, 
  verifyToken 
};
