const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ICI ➜ dossier singulier
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification (inscription, connexion, profil)
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "MotDePasseUltraSecret123!"
 *               role:
 *                 type: string
 *                 description: Optionnel, par défaut USER
 *                 example: "ADMIN"
 *     responses:
 *       201:
 *         description: Utilisateur créé + token JWT retourné
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     role:
 *                       type: string
 *                       example: "USER"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: email ou password manquants
 *       409:
 *         description: Email déjà utilisé
 *       500:
 *         description: Erreur serveur
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur existant
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "MotDePasseUltraSecret123!"
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne l'utilisateur + token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     role:
 *                       type: string
 *                       example: "USER"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: email ou password manquants
 *       401:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Récupère les informations de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     role:
 *                       type: string
 *                       example: "USER"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-17T14:32:00.123Z"
 *       401:
 *         description: Non authentifié (token manquant ou invalide)
 *       500:
 *         description: Erreur serveur
 */
router.get('/me', protect, authController.me);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Rafraîchir le token d'accès (Access Token)
 *     description: |
 *       Permet d'obtenir un **nouveau accessToken** et un **nouveau refreshToken** à partir d'un refresh token valide.
 *       Le refresh token doit être envoyé dans le header **Authorization: Bearer <refreshToken>**.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []   # On utilise le refresh token comme Bearer
 *     responses:
 *       200:
 *         description: Nouveaux tokens générés avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     role:
 *                       type: string
 *                       example: "USER"
 *                 accessToken:
 *                   type: string
 *                   example: "nouveau_access_token_jwt"
 *                 refreshToken:
 *                   type: string
 *                   example: "nouveau_refresh_token_jwt"
 *       400:
 *         description: Refresh token manquant.
 *       401:
 *         description: Refresh token invalide ou expiré.
 *       404:
 *         description: Utilisateur introuvable.
 *       500:
 *         description: Erreur serveur.
 */
router.post('/refresh', authController.refresh);


module.exports = router;
