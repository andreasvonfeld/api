const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { signToken, hashPassword, comparePassword } = require('../utils/auth');

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email et password requis' });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email déjà utilisé' });

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: passwordHash, role: role || 'USER' },
      select: { id: true, email: true, role: true }
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.status(201).json({ user, token });
  } catch (e) {
    res.status(500).json({ message: 'Erreur serveur', detail: e.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email et password requis' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Identifiants invalides' });

    const ok = await comparePassword(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Identifiants invalides' });

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
  } catch (e) {
    res.status(500).json({ message: 'Erreur serveur', detail: e.message });
  }
};

//GET /api/auth/allUsers
exports.allUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true }
    });
    res.json({ users });
  } catch (e) {
    res.status(500).json({ message: 'Erreur serveur', detail: e.message });
  } };

// GET /api/auth/me
exports.me = async (req, res) => {
  try {
    const me = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, role: true, createdAt: true }
    });
    res.json({ user: me });
  } catch (e) {
    res.status(500).json({ message: 'Erreur serveur', detail: e.message });
  }
};
