const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { 
  signToken, 
  signRefreshToken, 
  hashPassword, 
  comparePassword,
  verifyToken
} = require('../utils/auth');

// POST /api/v1/auth/register
exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email et password requis' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email déjà utilisé' });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: passwordHash, role: role || 'USER' },
      select: { id: true, email: true, role: true }
    });

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = signToken(payload);
    const refreshToken = signRefreshToken(payload);

    res.status(201).json({ user, accessToken, refreshToken });
  } catch (e) {
    console.error('register error:', e);
    res.status(500).json({ message: 'Erreur serveur', detail: e.message });
  }
};

// POST /api/v1/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email et password requis' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const ok = await comparePassword(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = signToken(payload);
    const refreshToken = signRefreshToken(payload);

    res.json({ 
      user: { id: user.id, email: user.email, role: user.role }, 
      accessToken,
      refreshToken
    });
  } catch (e) {
    console.error('login error:', e);
    res.status(500).json({ message: 'Erreur serveur', detail: e.message });
  }
};

// POST /api/v1/auth/refresh
// Le refreshToken est envoyé dans le header Authorization: Bearer <token>
exports.refresh = async (req, res) => {
  try {
    // Récupérer le refresh token depuis le header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Refresh token manquant' });
    }

    const refreshToken = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = verifyToken(refreshToken); // utilise JWT_SECRET en interne
    } catch (err) {
      console.error('refresh token invalid:', err);
      return res.status(401).json({ message: 'Refresh token invalide ou expiré' });
    }

    // Vérifier que l'utilisateur existe toujours
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    const payload = { id: user.id, email: user.email, role: user.role };

    const newAccessToken = signToken(payload);
    const newRefreshToken = signRefreshToken(payload);

    return res.status(200).json({
      user,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('refresh error:', error);
    res.status(500).json({ message: 'Erreur serveur', detail: error.message });
  }
};

// GET /api/v1/auth/me
exports.me = async (req, res) => {
  try {
    const me = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, role: true, createdAt: true }
    });
    res.json({ user: me });
  } catch (e) {
    console.error('me error:', e);
    res.status(500).json({ message: 'Erreur serveur', detail: e.message });
  }
};
